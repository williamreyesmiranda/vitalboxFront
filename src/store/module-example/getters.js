export const currentAllPatients = (state) => (term = "") => {

  // return state.patients || '';
  if (term.length === 0) return state.patients;
  return state.patients.filter((entry) =>
    entry.name.toLowerCase().includes(term.toLowerCase())
  );
}



export const currentIsLoading = (state) => {
  return state.isLoading || false;
}


