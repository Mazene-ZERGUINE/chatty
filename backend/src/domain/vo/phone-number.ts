export class PhoneNumber {
  constructor(
    private readonly countryCode: string,
    private readonly number: string,
  ) {}

  static create(countryCode: string, number: string): PhoneNumber {
    if (!countryCode || !number) {
      throw new Error('Invalid phone number');
    }
    if (number.toString().length > 10) {
      throw new Error('Invalid phone number');
    }
    return new PhoneNumber(countryCode, number);
  }

  equals(other: PhoneNumber): boolean {
    if (!other) return false;
    return (
      this.countryCode === other.countryCode && this.number === other.number
    );
  }

  toPhoneNumber(): string {
    return `${this.countryCode}-${this.number}`;
  }
}
