export interface IInvestmentSettingsForm {
  stages: [
    {
      value: number;
      label: string;
    }
  ];
  investmentLocations: [
    {
      value: number;
      label: string;
    }
  ];
  sector: [
    {
      value: number;
      label: string;
    }
  ];
  investmentRangeMin: number;
  investmentRangeMax: number;
  background: string;
  insiderInformation: string;
}
