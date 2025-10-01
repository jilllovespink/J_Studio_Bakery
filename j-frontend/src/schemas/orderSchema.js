import * as yup from "yup";

// 動態 schema，根據 isHome 判斷地址必填
export const orderSchema = yup.object({
  name: yup
    .string()
    .matches(/^[\u4e00-\u9fa5a-zA-Z\s]+$/, "姓名只能包含中文或英文")
    .required("姓名必填"),
  phone: yup
    .string()
    .matches(/^(\d{8,10}|\d{2,4}-\d{6,8})(\s*分機\d+)?$/, "電話格式不正確")
    .required("電話必填"),
  email: yup.string().email("Email 格式不正確").required("Email 必填"),
  address: yup.string().when("$isHome", {
    is: true,
    then: (s) => s.min(5, "地址過短").required("地址必填"),
    otherwise: (s) => s.notRequired(),
  }),
  pickupDate: yup.string().required("請選擇出貨日期"),
  paymentMethod: yup.string().required("請選擇付款方式"),
});
