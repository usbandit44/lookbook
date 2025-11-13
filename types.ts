import { itemTypes } from "@/constants/constants";

type Item = {
  type: (typeof itemTypes)[keyof typeof itemTypes];
  img: string;
};
