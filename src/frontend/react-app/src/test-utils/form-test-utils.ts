import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserEvent } from '@testing-library/user-event/dist/types/setup/setup';

/**
 * Type definition for form field data
 */
interface FormFields {
  [key: string]: string;
}

/**
 * Utility to fill all fields in a form
 *
 * @param user UserEvent instance
 * @param formFields Object with field names as keys and values to enter
 */
export const fillForm = async (
  user: UserEvent,
  formFields: FormFields
): Promise<void> => {
  for (const [fieldName, value] of Object.entries(formFields)) {
    // Try to find the input by name, placeholder, label text, or role
    const input = screen.getByRole('textbox', { name: new RegExp(fieldName, 'i') }) ||
                  screen.getByPlaceholderText(new RegExp(fieldName, 'i')) ||
                  screen.getByLabelText(new RegExp(fieldName, 'i')) ||
                  screen.getByTestId(fieldName);

    await user.clear(input);
    await user.type(input, value);
  }
};

/**
 * Utility to submit a form after filling it
 *
 * @param user UserEvent instance
 * @param formFields Object with field names as keys and values to enter
 * @param submitButtonText Text on the submit button (default: 'Submit')
 */
export const fillAndSubmitForm = async (
  user: UserEvent,
  formFields: FormFields,
  submitButtonText = 'Submit'
): Promise<void> => {
  // Fill out the form
  await fillForm(user, formFields);

  // Find and click the submit button
  const submitButton = screen.getByRole('button', { name: new RegExp(submitButtonText, 'i') });
  await user.click(submitButton);
};

/**
 * Utility to check form validation errors
 *
 * @param fieldName Name of the field to validate
 * @returns Object with functions to check validation state
 */
export const formValidation = (fieldName: string) => {
  return {
    /**
     * Check if field has an error
     */
    hasError: (): boolean => {
      try {
        // Look for error messages associated with this field
        const errorElement = screen.queryByText(new RegExp(`(${fieldName}|this field).*error`, 'i'));
        if (errorElement) return true;

        // Look for ARIA invalid state
        const field = screen.queryByLabelText(new RegExp(fieldName, 'i')) ||
                     screen.queryByPlaceholderText(new RegExp(fieldName, 'i')) ||
                     screen.queryByTestId(new RegExp(`${fieldName}`, 'i'));

        return field ? field.getAttribute('aria-invalid') === 'true' : false;
      } catch (e) {
        return false;
      }
    },

    /**
     * Get error message for field
     */
    getErrorMessage: (): string | null => {
      try {
        // First try finding by aria-describedby
        const field = screen.queryByLabelText(new RegExp(fieldName, 'i')) ||
                     screen.queryByPlaceholderText(new RegExp(fieldName, 'i')) ||
                     screen.queryByTestId(new RegExp(`${fieldName}`, 'i'));

        if (field) {
          const describedBy = field.getAttribute('aria-describedby');
          if (describedBy) {
            const errorElement = document.getElementById(describedBy);
            if (errorElement) return errorElement.textContent;
          }
        }

        // If not found, look for error text near the field
        const errorElement = screen.queryByText(new RegExp(`(${fieldName}|this field).*error`, 'i'));
        return errorElement ? errorElement.textContent : null;
      } catch (e) {
        return null;
      }
    }
  };
};

/**
 * Utility to select an option from a dropdown
 *
 * @param user UserEvent instance
 * @param selectName The name or label of the select element
 * @param optionText The text of the option to select
 */
export const selectOption = async (
  user: UserEvent,
  selectName: string,
  optionText: string
): Promise<void> => {
  // Find the select element
  const select = screen.getByRole('combobox', { name: new RegExp(selectName, 'i') }) ||
                screen.getByLabelText(new RegExp(selectName, 'i')) ||
                screen.getByTestId(new RegExp(`${selectName}`, 'i'));

  // Click to open the dropdown
  await user.click(select);

  // Find and click the option
  const option = screen.getByRole('option', { name: new RegExp(optionText, 'i') });
  await user.click(option);
};
