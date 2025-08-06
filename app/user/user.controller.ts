import axios from "axios";
import { type Request, type Response } from "express";
import asyncHandler from "express-async-handler";
import createHttpError from "http-errors";
import verifyAppleToken from "verify-apple-id-token";
import { createResponse } from "../common/helper/response.hepler";
import { sendEmail } from "../common/services/email.service";
import {
  createUserTokens,
  decodeToken,
  isValidPassword,
  verifyToken,
} from "../common/services/passport-jwt.service";
import { BadgeType, ProviderType } from "./user.dto";
import { hashPassword } from "./user.schema";
import * as userService from "./user.service";
import { generateCommissions } from "../commission/commission.service";
import * as bankService from "../bank/bank.service";
import { verifyReferralPin } from "../referrals/referrals.service";
import * as referralsService from "../referrals/referrals.service";
import { Types } from "mongoose";
import dayjs from "dayjs";

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const result = await userService.createUser(req.body);
  res.send(createResponse(result, "User created sucssefully"));
});

export const inviteUser = asyncHandler(async (req: Request, res: Response) => {
  const { badgeType, password, user } = req.body;
  if (!req.user) {
    throw createHttpError(400, { message: "Invalid user" });
  }
  const validUser = await userService.getUserById(user);
  if (!validUser) {
    throw createHttpError(400, { message: "Invalid selected user" });
  }
  const userInfo = await userService.getUserById(req.user._id, { password: true })
  const validate = await isValidPassword(password, userInfo?.password!);
  if (!validate) {
    throw new Error("Invalid password")
  }
  const pin = referralsService.generateReferralPin()

  const exists = await referralsService.getReferralsByPin(pin);
  if (exists) {
    res.status(400).json({ error: 'Try again. PIN already exists' });
    return;
  }

  const result = await referralsService.createReferrals({
    pin,
    referrerId: new Types.ObjectId(user),
    expiresAt: dayjs().add(30, 'days').toDate(),
    isUsed: false,
    badgeType
  });
  res.send(createResponse(result, "Pin generated successfully."));
});

export const verifyInvitation = asyncHandler(
  async (req: Request, res: Response) => {
    const { pin, email, password, name, phone } = req.body;

    const referralInfo = await verifyReferralPin(pin);

    const user = await userService.createUser({
      email,
      role: "USER",
      active: true,
      badgeType: referralInfo?.badgeType ?? "green",
      provider: ProviderType.MANUAL,
      referrerId: referralInfo.referrerId._id,
      password,
      name,
      phone,
      userId: userService.generateUserId()
    });
    await referralsService.editReferrals(referralInfo._id, { isUsed: true, usedBy: new Types.ObjectId(user._id) })

    const amount = process.env.COMMISSION_AMOUNT || 2000;
    await generateCommissions(user._id, Number(amount));
    res.send(createResponse(null, "User verified sucssefully"));
  },
);

export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId, password } = req.body;
    console.log('userId: ', userId);
    const user = await userService.getUserById(userId, {
      refreshToken: true,
      active: true,
    });

    if (!user) {
      throw createHttpError(400, { message: "Invlid User" });
    }

    if (!user?.active) {
      throw createHttpError(400, {
        message: "User is not active",
      });
    }

    if (user?.blocked) {
      throw createHttpError(400, { message: "User is blocked" });
    }
    await userService.editUser(user._id, {
      password: await hashPassword(password),
      refreshToken: "",
    });
    res.send(createResponse(null, "Password updated sucssefully"));
  },
);

export const changePassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { currentPassword, password } = req.body;
    const user = await userService.getUserById(req.user?._id!, {
      refreshToken: true,
      active: true,
      password: true,
      provider: true,
    });

    if (!user) {
      throw createHttpError(400, { message: "Invalid user" });
    }

    if (user.provider === ProviderType.MANUAL) {
      const validPassword = await isValidPassword(
        currentPassword,
        user.password!,
      );
      if (!validPassword) {
        throw createHttpError(400, {
          message: "Current password doesn't matched",
        });
      }
    }

    await userService.editUser(user._id, {
      password: await hashPassword(password),
      provider: ProviderType.MANUAL,
    });
    res.send(createResponse(null, "Password changed sucssefully"));
  },
);

export const requestResetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;

    const user = await userService.getUserByEmail(email, {
      active: true,
      blocked: true,
      email: true,
    });

    if (!user?.active) {
      throw createHttpError(400, {
        message: "User is not active",
      });
    }

    if (user?.blocked) {
      throw createHttpError(400, { message: "User is blocked" });
    }

    const tokens = createUserTokens(user);

    await userService.editUser(user._id, {
      refreshToken: tokens.refreshToken,
    });

    const url = `${process.env.FE_BASE_URL}/reset-password?code=${tokens.refreshToken}&type=reset-password`;
    console.log(url);

    sendEmail({
      to: email,
      subject: "Reset password",
      html: `<body to create profile> ${url}`,
    });
    res.send(createResponse(null, "Reset password link sent to your email."));
  },
);

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const result = await userService.updateUser(req.params.id, req.body);
  res.send(createResponse(result, "User updated sucssefully"));
});

export const editUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, bankDetails = null } = req.body;
  const anotherUser = await userService.getUserByEmailWithoutUserId(email, req.params.id)
  if (anotherUser) {
    throw createHttpError(400, { message: "Email already exists" });
  }
  const result = await userService.editUser(req.params.id, { name, email });
  if (bankDetails) {
    if (result?.bankDetails) {
      await bankService.editBank(result.bankDetails, bankDetails);
    } else {
      const bank = await bankService.createBank(bankDetails);
      await userService.editUser(result!._id, { bankDetails: bank._id });
    }
  }
  res.send(createResponse(result, "User updated sucssefully"));
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const result = await userService.deleteUser(req.params.id);
  res.send(createResponse(result, "User deleted sucssefully"));
});

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const result = await userService.getUserByIdWithBankDetails(req.params.id);
  res.send(createResponse(result));
});

export const getAllUser = asyncHandler(async (req: Request, res: Response) => {
  const skip = req.query.skip ? parseInt(req.query.skip as string) : undefined;
  const limit = req.query.limit
    ? parseInt(req.query.limit as string)
    : undefined;
  const search = req.query?.search ? req.query.search.toString().trim() : "";
  const result = await userService.getAllUser({ search }, {}, { skip, limit });

  const total = await userService.countItems();
  res.send(createResponse({ list: result, total }));
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw createHttpError(400, { message: "Invalid attempt to login" });
  }

  const tokens = createUserTokens(req.user);

  await userService.editUser(req.user._id, {
    refreshToken: tokens.refreshToken,
  });
  res.send(createResponse(tokens));
});

export const verifyOtp = asyncHandler(async (req: Request, res: Response) => {
  const { otp, email } = req.body;
  const user = await userService.getUserByEmail(email, "-password");
  if (!user) {
    throw createHttpError(400, {
      message: `User with email ${email} not found`,
    });
  }
  if (user?.otp != otp) {
    throw createHttpError(400, { message: "Invalid OTP" });
  }

  const tokens = createUserTokens(user);

  await userService.editUser(user._id, {
    refreshToken: tokens.refreshToken,
  });
  res.send(createResponse(tokens));
});
export const resendOtp = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;
  const user = await userService.getUserByEmail(email, "-password");
  if (!user) {
    throw createHttpError(400, {
      message: `User with email ${email} not found`,
    });
  }
  const otp = Math.floor(100000 + Math.random() * 900000);
  await userService.editUser(user._id, {
    otp,
  });
  await sendEmail({
    to: user.email,
    subject: "EMAIL verification",
    html: `<p>${otp}</p>`,
  });

  res.send(createResponse({ otp }));
});
export const getUserInfo = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.getUserById(req.user?._id!);
  res.send(createResponse(user));
});

export const getUserProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await userService.getUserByIdWithBankDetails(req.user?._id!, {
      password: false,
    });
    res.send(createResponse(user));
  },
);

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user!;
  await userService.editUser(user._id, { refreshToken: "" });
  res.send(createResponse({ message: "User logout successfully!" }));
});

export const refreshToken = asyncHandler(
  async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    const { email } = verifyToken(refreshToken);
    const user = await userService.getUserByEmail(email, {
      refreshToken: true,
      active: true,
      blocked: true,
      email: true,
      role: true,
    });
    if (!user || refreshToken !== user.refreshToken) {
      throw createHttpError({ message: "Invalid session" });
    }
    if (!user?.active) {
      throw createHttpError({ message: "User is not active" });
    }
    if (user?.blocked) {
      throw createHttpError({ message: "User is blocked" });
    }
    delete user.refreshToken;
    const tokens = createUserTokens(user);
    await userService.editUser(user._id, {
      refreshToken: tokens.refreshToken,
    });
    res.send(createResponse(tokens));
  },
);

export const appleLogin = asyncHandler(async (req: Request, res: Response) => {
  if (!process.env.APPLE_BUNDLE_ID) {
    throw createHttpError({ message: "Apple bundle id not configured!" });
  }

  const jwtClaims = await verifyAppleToken({
    idToken: req.body.id_token,
    clientId: process.env.APPLE_BUNDLE_ID || "",
  });

  const existUser = await userService.getUserByEmail(jwtClaims.email);
  const user =
    existUser ??
    (await userService.createUser({
      email: jwtClaims.email,
      provider: ProviderType.APPLE,
      name: "",
      active: true,
      role: "USER",
      badgeType: "green",
    }));
  const tokens = createUserTokens(user);
  await userService.editUser(user._id, { refreshToken: tokens.refreshToken });
  res.send(createResponse(tokens));
});

export const fbLogin = asyncHandler(async (req: Request, res: Response) => {
  const urlSearchParams = new URLSearchParams({
    fields: "id,name,email,picture",
    access_token: req.body.access_token,
  });
  const { data } = await axios.get<{
    id: string;
    name: string;
    email: string;
    picture: {
      data: {
        url: string;
      };
    };
  }>(`https://graph.facebook.com/v15.0/me?${urlSearchParams.toString()}`);

  const existUser = await userService.getUserByEmail(data.email);
  const user =
    existUser ??
    (await userService.createUser({
      email: data.email,
      provider: ProviderType.FACEBOOK,
      facebookId: data.id,
      image: data.picture.data.url,
      name: data?.name,
      role: "USER",
      badgeType: "green",
    }));
  const tokens = createUserTokens(user);
  await userService.editUser(user._id, { refreshToken: tokens.refreshToken });
  res.send(createResponse(tokens));
});

export const googleLogin = asyncHandler(async (req: Request, res: Response) => {
  const { data } = await axios.get<{
    email: string;
    name: string;
    picture: string;
  }>("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: "Bearer " + req.body.access_token },
  });

  const { email, name = " ", picture } = data;

  const existUser = await userService.getUserByEmail(data.email);
  const user =
    existUser ??
    (await userService.createUser({
      email,
      name,
      provider: ProviderType.GOOGLE,
      image: picture,
      role: "USER",
      badgeType: "green",
    }));

  const tokens = createUserTokens(user);
  await userService.editUser(user._id, { refreshToken: tokens.refreshToken });
  res.send(createResponse(tokens));
});

export const linkedInLogin = asyncHandler(
  async (req: Request, res: Response) => {
    const { access_token } = req.body;

    const urlSearchParams = new URLSearchParams({
      oauth2_access_token: access_token,
    });

    const { data: userData } = await axios.get<{
      sub: string;
      given_name: string;
      family_name: string;
      email: string;
      picture: string;
      name: string;
    }>(`https://api.linkedin.com/v2/userinfo?${urlSearchParams.toString()}`);

    const existUser = await userService.getUserByEmail(userData.email);
    const user =
      existUser ??
      (await userService.createUser({
        email: userData.email,
        name: userData?.name,
        linkedinId: userData.sub,
        image: userData.picture,
        provider: ProviderType.LINKEDIN,
        role: "USER",
        badgeType: "green",
      }));
    const tokens = createUserTokens(user);
    await userService.editUser(user._id, { refreshToken: tokens.refreshToken });
    res.send(createResponse(tokens));
  },
);
export const getUserReferralTree = asyncHandler(
  async (req: Request, res: Response) => {
    const tree = await userService.buildReferralTree(req.user?._id!);
    res.send(createResponse(tree));
  },
);
