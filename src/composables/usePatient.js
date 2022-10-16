import { computed, ref } from 'vue'
import { useStore } from 'vuex'

const usePatient = () => {
  const store = useStore()

  const getAllPatients = async () => {
    store.commit('patient/changeLoading', true)
    const resp = await store.dispatch('patient/getAllPatients');
    store.commit('patient/changeLoading', false)
  }

  const insertPatient = async (patient) => {
    try {
      const resp = await store.dispatch('patient/insertPatient', patient);
      if (resp.affectedRows > 0) return true;
      else return false;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  const deletePatient = async (idPatient) => {
    store.commit('patient/changeLoading', true)
    const resp = await store.dispatch('patient/deletePatient', idPatient);
    store.commit('patient/changeLoading', false)
    if (resp.affectedRows > 0) return true;
    else return false;

  }
  const updatePatient = async (idPatient, user) => {
    console.log(idPatient);
    store.commit('patient/changeLoading', true)
    const resp = await store.dispatch('patient/updatePatient', { idPatient, user });
    store.commit('patient/changeLoading', false)
    if (resp.affectedRows > 0) return true;
    else return false;
  }



  return {
    getAllPatients,
    insertPatient,
    deletePatient,
    updatePatient,
    patients: computed(() => store.getters['patient/currentAllPatients']),
    isLoading: computed(() => store.getters['patient/currentIsLoading']),
  }
}

export default usePatient;
