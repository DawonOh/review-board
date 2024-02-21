import React, { useState } from 'react';

const useJoinInput = (validateValue: (value: string) => boolean) => {
  const [enteredValue, setEnteredValue] = useState('');
  const [isTouched, setIsTouched] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const hasError = !isValid && isTouched;

  const valueChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEnteredValue(event.target.value);
    setIsValid(validateValue(event.target.value));
  };

  const inputClickHandler = () => {
    setIsTouched(true);
  };

  return {
    value: enteredValue,
    isValid,
    hasError,
    valueChangeHandler,
    inputClickHandler,
  };
};

export default useJoinInput;
