import { BusinessItem } from "./BusinessItem";
import { BusinessUser } from "./BusinessUser";


export interface Transaction {
  isPaid: boolean;
  emailUser: string;
  item: BusinessItem;
  user: BusinessUser;
}
