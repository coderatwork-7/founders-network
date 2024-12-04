import React, {useState} from 'react';
import Card from '@/ds/Card/card';

interface FunctionSponsorPropsType {
  details: string;
}

export const FunctionSponsor = ({details}: FunctionSponsorPropsType) => {
  const htmlContent = {__html: details};

  return (
    <Card className="text-start px-4 py-4">
      <h6 className="fw-bold text-uppercase">Sponsors</h6>
      <div dangerouslySetInnerHTML={htmlContent}></div>
    </Card>
  );
};
