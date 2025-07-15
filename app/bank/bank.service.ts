import { type IBank } from "./bank.dto";
import BankSchema from "./bank.schema";

export const createBank = async (data: IBank) => {
  const result = await BankSchema.create({ ...data, active: true });
  return result;
};

export const updateBank = async (id: string, data: IBank) => {
  const result = await BankSchema.findOneAndUpdate({ _id: id }, data, {
    new: true,
  });
  return result;
};

export const editBank = async (id: string, data: Partial<IBank>) => {
  const result = await BankSchema.findOneAndUpdate({ _id: id }, data);
  return result;
};

export const deleteBank = async (id: string) => {
  const result = await BankSchema.deleteOne({ _id: id });
  return result;
};

export const getBankById = async (id: string) => {
  const result = await BankSchema.findById(id).lean();
  return result;
};

export const getAllBank = async () => {
  const result = await BankSchema.find({}).lean();
  return result;
};
