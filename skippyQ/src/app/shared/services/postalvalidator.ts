import { AbstractControl, ValidationErrors } from '@angular/forms';

export function postalValidator(control: AbstractControl): ValidationErrors |null {
    const postal  = control.value;

    if (!postal || postal.length !== 6) {
      return { postalValidator: true };
    }

    return null;
  };
