import { FormField } from "@/types/form-field";

export const updateEmployeeField: FormField[] = [
  {
    name: "test",
    label: "test",

    type: "select",
    size: { md: 6 },
  },
  {
    name: "fullName",
    label: "Full name",
    placeholder: "Enter your full name",
    icon: "carbon:email",
    type: "input",
    size: { md: 6 },
  },
  {
    name: "email",
    label: "Email",
    placeholder: "",
    disabled: true,
    icon: "carbon:email",
    type: "input",
    size: { md: 6 },
  },

  {
    name: "dateOfBirth",
    label: "Date of birth",
    type: "date",
    icon: "material-symbols:person-outline-rounded",
    size: { md: 6 },
  },
  {
    name: "phone",
    label: "Phone",
    placeholder: "Enter your phone",
    icon: "material-symbols:phonelink-ring",
    type: "input",
    size: { md: 6 },
  },
  {
    type: "children",
    children: [
      {
        name: "address.number",
        label: "Number",
        placeholder: "Enter your number",
        icon: "fluent:location-16-regular",
        type: "input",
        size: { md: 6 },
      },

      {
        name: "address.street",
        label: "Street address",
        placeholder: "Enter street address",
        icon: "fluent:location-16-regular",
        type: "input",
        size: { md: 6 },
      },
      {
        name: "address.ward",
        label: "Ward address",
        placeholder: "Enter ward address",
        icon: "fluent:location-16-regular",
        type: "input",
        size: { md: 6 },
      },
      {
        name: "address.district",
        label: "District address",
        placeholder: "Enter district address",
        icon: "fluent:location-16-regular",
        type: "input",
        size: { md: 6 },
      },
      {
        name: "address.city",
        label: "City address",
        placeholder: "Enter city address",
        icon: "fluent:city-24-regular",
        type: "input",
        size: { md: 6 },
      },
    ],
  },
];
