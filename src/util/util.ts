import { BadRequestException } from '@nestjs/common';

export const PAGING_LIMIT: number = 10;
export const validateEmailAddress = (email: string) => {
  const regex = new RegExp(
    "([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|\"([]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|[[\t -Z^-~]*])",
  );
  if (!regex.test(email)) {
    throw new BadRequestException('이메일 양식이 유효하지 않습니다.');
  }
};

export const validatePassword = (password: string) => {
  const regex = new RegExp(
    '^(?=.*[!@#$%^&*()_+{}\\[\\]:;<>,.?/~`\\-\\\\|]).{8,}$',
  );
  if (!regex.test(password)) {
    throw new BadRequestException('비밀번호 양식이 유효하지 않습니다.');
  }
};
