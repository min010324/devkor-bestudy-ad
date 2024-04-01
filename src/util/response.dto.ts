export class ApiResponseDto {
  data: object;
  message: string;
  status: number;

  constructor(data: object, status: number, message?: string) {
    this.data = data;
    this.message = message || '정상적인 응답입니다.';
    this.status = status;
  }
}
