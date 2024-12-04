// import {Resolver} from 'react-hook-form';

export type ApplicationFormValues = {
  profile: {
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    nominator?: string;
    tags?: string[];
  };
  company: {
    city: string;
    startUpName: string;
    website?: string;
    companyAddress: string;
    state: string;
    country: string;
    zipCode: string;
    industrySectors: string[];
    techSectors: {label: string; value: string}[];
    stage: {label: string; value: string};
  };
  plan: {
    membership: {label: string; value: number};
  };
  countryCode: {label: string; value: string};
};

// export const applicationFormResolver: Resolver<
//   ApplicationFormValues
// > = async values => {
//   return {
//     values: values.profile ? values : {},
//     errors: !values
//       ? {
//           firstName: {
//             type: 'required',
//             message: 'This is required.'
//           },
//           lastName: {
//             type: 'required',
//             message: 'This is required'
//           }
//         }
//       : {}
//   };
// };
