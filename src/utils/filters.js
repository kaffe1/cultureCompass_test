//combined filters: all filters are applied together indicated by filters paramater
//filters is an object with the following properties:
//ageRange: [minAge, maxAge]
//sex: 1 for male, 2 for female
//country: country code

export const applyFilters = (data, filters) => {
  if (!data) return [];

  return data.filter(row => {
    // Filter by Age Range (e.g., [20, 40])
    if (filters.ageRange) {
      const age = parseInt(row.age, 10);
      // If age is invalid or missing (e.g., < 0 based on doc-of-data), or outside the range
      if (isNaN(age) || age < 0 || age < filters.ageRange[0] || age > filters.ageRange[1]) {
        return false;
      }
    }

    // Filter by Gender / Sex (1: male, 2: female,0: all)
    if (filters.sex && row.sex !== String(filters.sex)) {
      return false;
    }

    // Filter by Country Code (e.g., 'ARG')
    if (filters.country && row.countryCode !== filters.country) {
      return false;
    }


    // Add more filter conditions here as needed...

    return true; // Keep the row if it passes all filters
  });
};
