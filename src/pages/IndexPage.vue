<template>
  <q-page class="q-mt-xl">
    <div class="q-pa-md q-gutter-xl col-6">
      <q-btn color="primary" icon="person_add_alt" label="Crear Paciente" @click="createPatient" />
      <div style="max-width: 400px;">
        <q-input outlined standout="bg-teal text-white" v-model="keyword" label="Buscar por Nombre Paciente" />
      </div>

    </div>
    <div class="row q-mt-xl justify-center q-col-gutter-sm">
      <div class="col-12">
        <q-table title="Pacientes" :rows="users" :columns="columns" row-key="name" :loading="isLoading"
          :dense="$q.screen.lt.md" :pagination="initialPagination">
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn dense round flat color="grey" @click="viewData(props.row)" icon="visibility"></q-btn>
              <q-btn dense round flat color="grey" @click="editRow(props.row)" icon="edit"></q-btn>
              <q-btn dense round flat color="grey" @click="verifyDelete(props.row)" icon="delete"></q-btn>
            </q-td>
          </template>
        </q-table>
      </div>
    </div>
  </q-page>



  <q-dialog v-model="modal" persistent transition-show="scale" transition-hide="scale">
    <q-card class="" style="max-width: 400px">
      <q-card-section>
        <div class="text-h6">Valores para {{valueComputedModal.name}}</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="row">
          <div class="col-3">Edad:</div>
          <div class="col-6">{{valueComputedModal.age}}</div>
        </div>
        <div class="row">
          <div class="col-3">IMC</div>
          <div class="col-6">{{valueComputedModal.imc}}</div>
        </div>
      </q-card-section>

      <q-card-actions align="right" class="bg-white text-teal">
        <q-btn flat label="OK" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="modalUpdate" transition-show="scale" transition-hide="scale">
    <q-card class="" style="max-width: 400px">
      <q-card-section>
        <div class="text-h6">Editar Paciente</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-form ref="focus" @submit="onUpdate" class="q-gutter-md">
          <q-input filled v-model.trim.lazy="user.name" label="Nombre del Paciente *" lazy-rules
            :rules="[ val => val && val.length > 0 || 'Por favor ingresa el nombre del paciente']" />

          <q-select v-model="user.typeDni" :options="options" label="Tipo Documento *"
            :rules="[ val => val && val.length > 0 || 'Por favor ingresa el tipo de documento']" />

          <q-input filled type="number" v-model="user.dni" label="Número de documento *" lazy-rules :rules="[
            val => val !== null && val !== '' || 'Por favo ingresa el numero del documento',
          ]" />

          <q-date v-model="user.dateBirth"
            :rules="[ val => val !== null && val !== ''|| 'Ingresa la fecha de cumpleaños']" />

          <q-input filled type="number" v-model="user.weight" label="Peso (kg) *" lazy-rules :rules="[
            val => val !== null && val !== '' || 'Por favor inresa el peso del paciente',
            val => val > 0 && val < 400 || 'Por favor ingresa un peso real'
          ]" />

          <q-input filled type="number" v-model="user.height" label="Estatura (cms) *" lazy-rules :rules="[
            val => val !== null && val !== '' || 'Por favor ingresa la estatura del paciente',
            val => val > 0 && val < 250 || 'Por favor ingresa una estatura real'
          ]" />

          <div>
            <q-btn label="Actualizar Paciente" type="submit" color="primary" />
          </div>
        </q-form>
      </q-card-section>

      <q-card-actions align="right" class="bg-white text-teal">
        <q-btn flat label="Cancelar" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, watch, ref } from 'vue'
import { useRouter } from 'vue-router';
import usePatient from '../composables/usePatient';
import { useQuasar } from 'quasar'
import { computedYear } from '../helpers/obtainYearOld'

const columns = [

  { name: 'idPatient', align: 'center', label: 'ID', field: 'idPatient', sortable: true },
  { name: 'name', align: 'center', label: 'Nombre', field: 'name', sortable: true },
  { name: 'typeDni', align: 'center', label: 'Tipo Dcto', field: 'typeDni', sortable: true },
  { name: 'dni', align: 'center', label: 'Nro Dcto', field: 'dni', sortable: true },
  { name: 'dateBirth', align: 'center', label: 'Fecha Nacimiento', field: 'dateBirth', sortable: true },
  { name: 'weight', align: 'center', label: 'Peso', field: 'weight', sortable: true },
  { name: 'height', align: 'center', label: 'Altura', field: 'height', sortable: true },
  { name: 'createdAt', align: 'center', label: 'Creado el', field: 'createdAt', sortable: true },
  { name: 'updatedAt', align: 'center', label: 'Actualizado el', field: 'updatedAt', sortable: true },
  { name: 'actions', label: 'Acciones', field: '', align: 'center' },
]



export default defineComponent({
  name: 'IndexPage',
  setup() {
    const { patients, getAllPatients, isLoading, deletePatient, updatePatient } = usePatient();
    const users = ref([]);
    const user = ref('');
    const router = useRouter();
    const $q = useQuasar()
    const keyword = ref('');
    const modal = ref(false);
    const modalUpdate = ref(false);
    const valueComputedModal = ref({
      age: '',
      imc: '',
      name: ''
    });
    const initialPagination = ref({
      sortBy: 'desc',
      descending: false,
      page: 1,
      rowsPerPage: 15
      // rowsNumber: xx if getting data from a server
    })

    const editRow = (data) => {
      console.log(data);
      user.value = { ...data };
      user.value.dateBirth = user.value.dateBirth.replaceAll('-', '/');
      modalUpdate.value = true;
    }

    const verifyDelete = async (patient) => {
      console.log(patient);
      $q.dialog({
        title: 'Eliminar',
        message: `¿Desea eliminar el paciente ${patient.name} de la lista?`,
        cancel: true,
        persistent: true
      }).onOk(async () => {
        const resp = await deletePatient(patient.idPatient);
        if (resp) {
          $q.notify({
            color: 'success',
            icon: 'done',
            message: 'Paciente eliminado correctamente'
          })
          getAllPatients();

        } else {
          return $q.notify({
            color: 'red-5',
            textColor: 'white',
            icon: 'warning',
            message: 'Ocurrió un problema al intentar eliminar el paciente'
          })
        }
      })
    }

    const onUpdate = async () => {
      console.log('por aca');

      user.value.dni = parseInt(user.value.dni)
      user.value.weight = parseInt(user.value.weight)
      user.value.height = parseInt(user.value.height)
      const idPatient = user.value.idPatient;

      const resp = await updatePatient(idPatient, user.value);
      if (resp) {
        $q.notify({
          color: 'success',
          icon: 'done',
          message: 'Paciente eliminado correctamente'
        })
        getAllPatients();

      } else {
        return $q.notify({
          color: 'red-5',
          textColor: 'white',
          icon: 'warning',
          message: 'Ocurrió un problema al intentar eliminar el paciente'
        })
      }

      modalUpdate.value = false;
    }

    watch(
      () => patients.value(),
      () => {
        users.value = patients.value();
      }
    )

    watch(
      () => keyword.value,
      () => {
        users.value = patients.value(keyword.value);
      }
    )



    getAllPatients();

    return {
      keyword,
      initialPagination,
      patients,
      isLoading,
      modal,
      modalUpdate,
      editRow,
      onUpdate,
      columns,
      users,
      user,
      valueComputedModal,
      verifyDelete,
      createPatient: () => {
        router.push({ name: 'create' })
      },
      viewData: (patient) => {
        console.log(patient);
        const { dateBirth, height, weight, name } = patient;
        const fecha = new Date(dateBirth);
        valueComputedModal.value.age = computedYear(fecha);
        valueComputedModal.value.imc = (weight / Math.pow((height / 100), 2)).toFixed(2);
        valueComputedModal.value.name = name
        modal.value = true;
      },


    }
  }
})
</script>
