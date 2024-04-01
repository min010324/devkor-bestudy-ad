import { BadRequestException } from '@nestjs/common';

export const validateEmailAddress = (email: string) => {
  const regex = new RegExp(
    "([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|\"([]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|[[\t -Z^-~]*])",
  );
  if (!regex.test(email)) {
    throw new BadRequestException('이메일 양식이 유효하지 않습니다.');
  }
};
