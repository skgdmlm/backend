import { body, checkExact } from "express-validator";
import { ProviderType } from "./user.dto";
import * as userService from "./user.service";

export const login = checkExact([
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be valid"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isString()
    .withMessage("Password must be a string"),
]);

export const verifyInvitation = checkExact([
  body("name")
    .notEmpty()
    .bail()
    .withMessage("Name is required")
    .isString()
    .bail()
    .withMessage("Name must be string"),
  body("pin")
    .notEmpty()
    .bail()
    .withMessage("Pin is required")
    .isString()
    .bail()
    .withMessage("Token must be string"),
   body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be valid")
    .custom(async (value) => {
      const user = await userService.getUserByEmail(value);
      if (user) {
        throw new Error(`User with ${value} already exists!`);
      }
      return true;
    }),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isString()
    .withMessage("Password must be a string"),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Password confirmation does not match password");
    }
    return true;
  }),
]);
export const otpVerification = checkExact([
  body("otp")
    .notEmpty()
    .bail()
    .withMessage("OTP is required")
    .isNumeric()
    .bail()
    .withMessage("Token must be number"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be of valid type"),
]);
export const resendOtpVerification = checkExact([
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be of valid type"),
]);

export const changePassword = checkExact([
  body("currentPassword").custom(async (value, { req }) => {
    const user = await userService.getUserById(req.user._id, {
      provider: true,
    });
    if (user?.provider === ProviderType.MANUAL && !value)
      throw new Error("Current password is required.");
    return true;
  }),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isString()
    .withMessage("Password must be a string"),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Password confirmation does not match password");
    }
    return true;
  }),
]);

export const inviteUser = checkExact([
  body("badgeType")
    .optional()
    .isIn(["green", "yellow"])
    .withMessage("Badge type must be either green or yellow"),
]);

export const forgotPassword = checkExact([
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be valid")
    .custom(async (value) => {
      const user = await userService.getUserByEmail(value);
      if (!user) {
        throw new Error("User not found!");
      }
      if (user.provider !== ProviderType.MANUAL)
        throw new Error(`Please login with ${ProviderType.MANUAL}`);
      return true;
    }),
]);

export const createUser = checkExact([
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be valid")
    .custom(async (value) => {
      const user = await userService.getUserByEmail(value);
      if (user) throw new Error("Email is already exist.");
      return true;
    }),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isString()
    .withMessage("Password must be a string"),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Password confirmation does not match password");
    }
    return true;
  }),
]);

export const updateUser = [
  body("name")
    .notEmpty()
    .withMessage("name is required")
    .isString()
    .withMessage("name must be a string"),
  body("bankDetails").isObject().withMessage("Bank Details must be a object"),
  body("bankDetails.accountHolderName")
    .notEmpty()
    .withMessage("Account Holder Name is required")
    .isString()
    .withMessage("Account holder name must be valid"),
  body("bankDetails.bankName")
    .notEmpty()
    .withMessage("Bank Name is required")
    .isString()
    .withMessage("Bank name must be valid"),
  body("bankDetails.accountNumber")
    .notEmpty()
    .withMessage("Account Number is required")
    .isString()
    .withMessage("Account number must be valid"),
  body("bankDetails.ifscCode")
    .notEmpty()
    .withMessage("IFSC code is required")
    .isString()
    .withMessage("IFSC code must be valid"),
];

export const editUser = [
  body("name")
    .notEmpty()
    .withMessage("name is required")
    .isString()
    .withMessage("name must be a string"),
  body("bankDetails").isObject().withMessage("Bank Details must be a object"),
  body("bankDetails.accountHolderName")
    .notEmpty()
    .withMessage("Account Holder Name is required")
    .isString()
    .withMessage("Account holder name must be valid"),
  body("bankDetails.bankName")
    .notEmpty()
    .withMessage("Bank Name is required")
    .isString()
    .withMessage("Bank name must be valid"),
  body("bankDetails.accountNumber")
    .notEmpty()
    .withMessage("Account Number is required")
    .isString()
    .withMessage("Account number must be valid"),
  body("bankDetails.ifscCode")
    .notEmpty()
    .withMessage("IFSC code is required")
    .isString()
    .withMessage("IFSC code must be valid"),
];

export const refreshToken = [
  body("refreshToken")
    .notEmpty()
    .bail()
    .withMessage("Refresh token is required")
    .isString()
    .bail()
    .withMessage("refreshToken must be string"),
];

export const socialLogin = (name: string) => [
  body(name)
    .notEmpty()
    .bail()
    .withMessage(`${name} is required`)
    .isString()
    .bail()
    .withMessage(`${name} must be string`),
];
