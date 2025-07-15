import { type ICommissionRate } from "./commissionRate.dto";
import CommissionRateSchema from "./commissionRate.schema";

export const createCommissionRate = async (data: ICommissionRate) => {
  const result = await CommissionRateSchema.create({ ...data, active: true });
  return result;
};

export const updateCommissionRate = async (
  id: string,
  data: ICommissionRate,
) => {
  const result = await CommissionRateSchema.findOneAndUpdate(
    { _id: id },
    data,
    {
      new: true,
    },
  );
  return result;
};

export const editCommissionRate = async (
  id: string,
  data: Partial<ICommissionRate>,
) => {
  const result = await CommissionRateSchema.findOneAndUpdate({ _id: id }, data);
  return result;
};

export const deleteCommissionRate = async (id: string) => {
  const result = await CommissionRateSchema.deleteOne({ _id: id });
  return result;
};

export const getCommissionRateById = async (id: string) => {
  const result = await CommissionRateSchema.findById(id).lean();
  return result;
};

export const getAllCommissionRate = async () => {
  const result = await CommissionRateSchema.find({}).lean();
  return result;
};

export const getAllCommissionRateCount = async () => {
  const result = await CommissionRateSchema.count({});
  return result;
};

export const createBulkCommissionRate = async (
  rates: Omit<ICommissionRate, "_id" | "createdAt" | "updatedAt">[],
) => {
  const result = await CommissionRateSchema.insertMany(rates);
  return result;
};
