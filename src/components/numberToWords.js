import React, { useState } from 'react';

// Helper function to convert number to words
const numberToWords = (num) => {
  const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
  const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

  if (num === 0) return 'zero';

  const convertHundreds = (n) => {
    let result = '';
    if (n >= 100) {
      result += ones[Math.floor(n / 100)] + ' hundred ';
      n %= 100;
    }
    if (n >= 20) {
      result += tens[Math.floor(n / 10)] + ' ';
      n %= 10;
    } else if (n >= 10) {
      result += teens[n - 10] + ' ';
      return result;
    }
    if (n > 0) {
      result += ones[n] + ' ';
    }
    return result;
  };

  let result = '';
  let crores = Math.floor(num / 10000000);
  if (crores > 0) {
    result += convertHundreds(crores) + 'crore ';
    num %= 10000000;
  }

  let lakhs = Math.floor(num / 100000);
  if (lakhs > 0) {
    result += convertHundreds(lakhs) + 'lakh ';
    num %= 100000;
  }

  let thousands = Math.floor(num / 1000);
  if (thousands > 0) {
    result += convertHundreds(thousands) + 'thousand ';
    num %= 1000;
  }

  if (num > 0) {
    result += convertHundreds(num);
  }

  return result.trim() + ' only';
};

export default numberToWords;