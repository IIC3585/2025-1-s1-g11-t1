<template>
  <div class="app-container">
    <ConfirmDialog group="positioned"></ConfirmDialog>
    <Dialog v-model:visible="swapColumnsDialog" modal header="Swap Columns" :style="{ width: '35rem' }" class="p-dialog-custom">
      <div class="p-5">
        <span class="text-surface-600 block mb-6">Select the columns you want to swap.</span>
        <div class="flex flex-column gap-5">
          <div class="flex flex-column md:flex-row md:items-center gap-4">
            <label for="column1" class="font-semibold text-base w-32">First Column</label>
            <Dropdown
              id="column1"
              v-model="selectedColumn1"
              :options="columnOptions"
              optionLabel="header"
              placeholder="Select Column"
              class="w-full"
            />
          </div>
          <div class="flex flex-column md:flex-row md:items-center gap-4">
            <label for="column2" class="font-semibold text-base w-32">Second Column</label>
            <Dropdown
              id="column2"
              v-model="selectedColumn2"
              :options="columnOptions"
              optionLabel="header"
              placeholder="Select Column"
              class="w-full"
            />
          </div>
        </div>
        <div class="flex justify-end gap-3 mt-8">
          <Button type="button" label="Cancel" severity="secondary" text @click="closeSwapDialog"></Button>
          <Button type="button" label="Swap" severity="success" @click="handleSwapColumns"></Button>
        </div>
      </div>
    </Dialog>

    <Dialog v-model:visible="deleteColumnDialog" modal header="Delete Column" :style="{ width: '35rem' }" class="p-dialog-custom">
      <div class="p-5">
        <span class="text-surface-600 block mb-6">Select the column you want to delete.</span>
        <div class="flex flex-column gap-4">
          <div class="flex flex-column md:flex-row md:items-center gap-4">
            <label for="deleteColumn" class="font-semibold text-base w-32">Column</label>
            <Dropdown
              id="deleteColumn"
              v-model="columnToDelete"
              :options="columnOptions"
              optionLabel="header"
              placeholder="Select Column"
              class="w-full"
            />
          </div>
        </div>
        <div class="flex justify-end gap-3 mt-8">
          <Button type="button" label="Cancel" severity="secondary" text @click="closeDeleteDialog"></Button>
          <Button type="button" label="Delete" severity="danger" @click="handleDeleteColumn"></Button>
        </div>
      </div>
    </Dialog>

    <header>
      <Menubar class="border-none surface-0">
        <template #start>
          <div class="flex align-items-center gap-2">
            <i class="pi pi-file-import text-2xl"></i>
            <span class="font-bold text-xl">CSV Transformer</span>
          </div>
        </template>
        <template #end>
          <a href="https://github.com/IIC3585/2025-1-s1-g11-t1" 
             target="_blank" 
             class="flex align-items-center gap-2 text-color hover:text-primary no-underline ml-auto">
            <i class="pi pi-github text-2xl"></i>
            <span class="font-medium">@2025-1-s1-g11-t1</span>
          </a>
        </template>
      </Menubar>
    </header>

    <main class="layout-main">
      <div class="main-content">
        <div class="welcome-section">
          <h1 class="welcome-title">CSV Transformation Tool</h1>
          <p class="welcome-subtitle">Upload, transform and analyze your CSV files with ease</p>
        </div>

        <Panel class="mb-3">
          <template #header>
            <div class="flex align-items-center">
              <i class="pi pi-upload mr-2"></i>
              <span class="font-medium">Upload CSV File</span>
            </div>
          </template>
          
          <Toast />
          <FileUpload 
            name="csv" 
            :url="'/api/upload'" 
            @upload="onUpload" 
            :multiple="false"
            accept=".csv"
            :maxFileSize="10000000"
            @select="onSelectedFiles"
            :auto="true"
            :customUpload="true"
            @uploader="customUploader"
            @remove="onRemoveFile"
            :showUploadButton="false"
            :showCancelButton="false"
          >
            <template #header="{ chooseCallback, clearCallback, files }">
              <div class="flex flex-wrap align-items-center gap-2">
                <Button @click="chooseCallback()" icon="pi pi-file" rounded outlined severity="secondary" />
                <Button @click="handleClearAll(clearCallback)" icon="pi pi-times" rounded outlined severity="danger" />
              </div>
            </template>

            <template #content="{ files, uploadedFiles, removeUploadedFileCallback, removeFileCallback }">
              <div class="flex flex-column gap-4 pt-4">
                <div v-if="files.length > 0">
                  <h5>Pending</h5>
                  <div class="flex flex-wrap gap-4">
                    <div v-for="(file, index) of files" 
                         :key="file.name + file.type + file.size" 
                         class="p-4 border-1 border-round surface-border flex flex-column align-items-center gap-3">
                      <div class="flex align-items-center gap-2">
                        <i class="pi pi-file-import text-2xl"></i>
                        <span class="font-semibold text-overflow-ellipsis">{{ file.name }}</span>
                      </div>
                      <div>{{ formatSize(file.size) }}</div>
                      <Badge value="Pending" severity="warning" />
                      <Button icon="pi pi-times" 
                             @click="onRemoveFile(file, removeFileCallback, index)" 
                             outlined rounded severity="danger" />
                    </div>
                  </div>
                </div>

                <div v-if="uploadedFiles.length > 0">
                  <h5>Completed</h5>
                  <div class="flex flex-wrap gap-4">
                    <div v-for="(file, index) of uploadedFiles" 
                         :key="file.name + file.type + file.size" 
                         class="p-4 border-1 border-round surface-border flex flex-column align-items-center gap-3">
                      <div class="flex align-items-center gap-2">
                        <i class="pi pi-file-import text-2xl"></i>
                        <span class="font-semibold text-overflow-ellipsis">{{ file.name }}</span>
                      </div>
                      <div>{{ formatSize(file.size) }}</div>
                      <Badge value="Completed" severity="success" />
                      <Button icon="pi pi-times" 
                             @click="removeUploadedFileCallback(index)" 
                             outlined rounded severity="danger" />
                    </div>
                  </div>
                </div>
              </div>
            </template>

            <template #empty>
              <div class="flex align-items-center justify-content-center flex-column">
                <i class="pi pi-file-import border-2 border-round p-5 text-4xl text-600" />
                <p class="mt-4 mb-0">Drag and drop CSV files here to upload</p>
              </div>
            </template>
          </FileUpload>

          <Message v-if="error" severity="error" :closable="false" class="mt-3">
            {{ error }}
          </Message>
        </Panel>

        <Panel v-if="data.length" class="mb-3">
          <template #header>
            <div class="flex align-items-center">
              <i class="pi pi-sliders-h mr-2"></i>
              <span class="font-medium">Transformations</span>
            </div>
          </template>
          <div class="card">
            <Toolbar>
              <template #start>
                <div class="flex gap-2">
                  <Button
                    v-for="(btn, index) in toolbarButtons"
                    :key="index"
                    :icon="btn.icon"
                    :label="btn.label"
                    :disabled="btn.disabled"
                    severity="secondary"
                    outlined
                    :class="btn.class"
                    @click="btn.onClick"
                  />
                </div>
              </template>
            </Toolbar>
          </div>
        </Panel>

        <Panel v-if="data.length">
          <template #header>
            <div class="flex align-items-center justify-content-between w-full">
              <div class="flex align-items-center">
                <i class="pi pi-table mr-2"></i>
                <span class="font-medium">Data Preview</span>
              </div>
              <div class="flex align-items-center gap-4">
                <Button
                  icon="pi pi-download"
                  label="Export as HTML"
                  severity="success"
                  text
                  class="p-button-export"
                  @click="handleExport"
                />
                <Button
                  icon="pi pi-file-export"
                  label="Export as CSV"
                  severity="success"
                  text
                  class="p-button-export"
                  @click="handleExportCSV"
                />
              </div>
            </div>
          </template>
          <DataTable
            :value="data"
            responsiveLayout="scroll"
            class="p-datatable-sm"
            showGridlines
            v-if="data.length"
            selectionMode="single"
            v-model:selection="selectedRow"
            dataKey="id"
            :scrollable="true"
            scrollHeight="400px"
          >
            <Column
              v-for="col in visibleColumns"
              :key="col"
              :field="col"
              :header="col"
              sortable
            />
          </DataTable>
        </Panel>
      </div>
    </main>

    <footer class="layout-footer">
      <div class="footer-content">
        <i class="pi pi-code"></i>
        <p>Made by Manuel and Pedro 🤘</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useToast } from "primevue/usetoast"
import { useConfirm } from "primevue/useconfirm"

import { swapColumns, transpose, deleteRow, deleteColumn } from './transformations/csvTransformations'
import { formatFileSize, formatToHTML } from './formatters/fileFormatters'
import { parseCSVFile, downloadContent, convertToCSV } from './utils/fileUtils'

import Panel from 'primevue/panel'
import Button from 'primevue/button'
import FileUpload from 'primevue/fileupload'
import Message from 'primevue/message'
import Menubar from 'primevue/menubar'
import Toolbar from 'primevue/toolbar'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Toast from 'primevue/toast'
import Badge from 'primevue/badge'
import ConfirmDialog from 'primevue/confirmdialog'
import Dialog from 'primevue/dialog'
import Dropdown from 'primevue/dropdown'

const toast = useToast()
const confirm = useConfirm()

const data = ref([])
const error = ref('')
const selectedRow = ref(null)
const selectedColumn = ref(null)
const files = ref([])

const formatSize = (bytes) => formatFileSize(bytes)

const swapColumnsDialog = ref(false)
const selectedColumn1 = ref(null)
const selectedColumn2 = ref(null)
const columnOptions = computed(() => {
  if (!data.value || data.value.length === 0) return []
  return Object.keys(data.value[0])
    .filter(key => key !== 'id')
    .map((key, index) => ({
      header: key,
      field: key,
      index
    }))
})

const deleteColumnDialog = ref(false)
const columnToDelete = ref(null)

const onRemoveFile = (file, removeFileCallback, index) => {
  if (removeFileCallback) {
    removeFileCallback(index)
  }
  clearAllData()
}

const clearAllData = () => {
  files.value = []
  data.value = []
  error.value = ''
  selectedRow.value = null
  selectedColumn.value = null
  selectedColumn1.value = null
  selectedColumn2.value = null
  columnToDelete.value = null
  swapColumnsDialog.value = false
  deleteColumnDialog.value = false
}

const handleClearAll = (clearCallback) => {
  if (clearCallback) {
    clearCallback()
  }
  clearAllData()
  toast.add({ 
    severity: 'info', 
    summary: 'Cleared', 
    detail: 'All files and data have been cleared', 
    life: 3000 
  })
}

const customUploader = async (event) => {
  try {
    const file = event.files[0]
    if (file) {
      data.value = await parseCSVFile(file)
      error.value = ''
      toast.add({ severity: "success", summary: "Success", detail: "CSV File Processed", life: 3000 })
    }
  } catch (err) {
    error.value = err.message
    toast.add({ severity: "error", summary: "Error", detail: err.message, life: 3000 })
  }
}

const onSelectedFiles = (event) => {
  files.value = event.files
}

const onUpload = () => {
  toast.add({ severity: "success", summary: "Success", detail: "File uploaded successfully", life: 3000 })
}

const handleTranspose = () => {
  data.value = transpose(data.value)
}

const handleDeleteRow = () => {
  if (!selectedRow.value) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Please select a row to delete', life: 3000 })
    return
  }
  
  confirm.require({
    group: 'positioned',
    message: 'Are you sure you want to delete this row?',
    header: 'Delete Confirmation',
    icon: 'pi pi-exclamation-triangle',
    position: 'bottom',
    accept: () => {
      const selectedId = selectedRow.value.id
      const index = data.value.findIndex(row => row.id === selectedId)
      
      if (index !== -1) {
        data.value = data.value.filter(row => row.id !== selectedId)
        selectedRow.value = null
        toast.add({ severity: 'success', summary: 'Success', detail: 'Row deleted successfully', life: 3000 })
      } else {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Could not find the selected row', life: 3000 })
      }
    },
    acceptClass: 'p-button-danger',
    acceptIcon: 'pi pi-trash',
    rejectClass: 'p-button-text',
    class: 'custom-confirm-dialog'
  })
}

const handleDeleteColumn = () => {
  if (!columnToDelete.value) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Please select a column to delete', life: 3000 })
    return
  }

  if (columnToDelete.value.field === 'id') {
    toast.add({ 
      severity: 'error', 
      summary: 'Error', 
      detail: 'The ID column cannot be deleted as it is required for row identification', 
      life: 3000 
    })
    closeDeleteDialog()
    return
  }

  confirm.require({
    group: 'positioned',
    message: 'Are you sure you want to delete this column? This action cannot be undone.',
    header: 'Delete Confirmation',
    icon: 'pi pi-exclamation-triangle',
    position: 'bottom',
    accept: () => {
      data.value = deleteColumn(columnToDelete.value.field)(data.value)
      toast.add({ severity: 'success', summary: 'Success', detail: 'Column deleted successfully', life: 3000 })
      closeDeleteDialog()
    },
    acceptClass: 'p-button-danger',
    acceptIcon: 'pi pi-trash',
    rejectClass: 'p-button-text',
    class: 'custom-confirm-dialog'
  })
}

const handleExport = () => {
  const html = formatToHTML(data.value)
  downloadContent(html, 'transformed-data.html', 'text/html')
}

const handleExportCSV = () => {
  const csv = convertToCSV(data.value)
  downloadContent(csv, 'transformed-data.csv', 'text/csv')
}

const openSwapDialog = () => {
  selectedColumn1.value = null
  selectedColumn2.value = null
  swapColumnsDialog.value = true
}

const closeSwapDialog = () => {
  selectedColumn1.value = null
  selectedColumn2.value = null
  swapColumnsDialog.value = false
}

const handleSwapColumns = () => {
  if (!selectedColumn1.value || !selectedColumn2.value) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Please select both columns', life: 3000 })
    return
  }

  const col1 = selectedColumn1.value.field
  const col2 = selectedColumn2.value.field
  
  try {
    const tempData = data.value.map(row => {
      const newRow = { ...row }
      
      const tempValue = newRow[col1]
      newRow[col1] = newRow[col2]
      newRow[col2] = tempValue
      
      return newRow
    })
    
    const processedData = tempData.map(row => {
      const newObj = {}
      
      newObj.id = row.id
      
      Object.keys(row).forEach(key => {
        if (key === 'id') return
        
        if (key === col1) {
          newObj[col2] = row[col1]
        } else if (key === col2) {
          newObj[col1] = row[col2]
        } else {
          newObj[key] = row[key]
        }
      })
      
      return newObj
    })
    
    data.value = []
    setTimeout(() => {
      data.value = processedData
      toast.add({ severity: 'success', summary: 'Success', detail: 'Columns swapped successfully', life: 3000 })
    }, 50)
  } catch (error) {
    console.error('Error swapping columns:', error)
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to swap columns', life: 3000 })
  }
  
  closeSwapDialog()
}

const openDeleteDialog = () => {
  columnToDelete.value = null
  deleteColumnDialog.value = true
}

const closeDeleteDialog = () => {
  columnToDelete.value = null
  deleteColumnDialog.value = false
}

const toolbarButtons = computed(() => {
  const buttons = [
    {
      icon: 'pi pi-arrows-h',
      label: 'Swap Columns',
      onClick: openSwapDialog,
      class: 'p-button-transformation'
    }
  ]

  if (data.value.length < 5) {
    buttons.push({
      icon: 'pi pi-sync',
      label: 'Transpose Data',
      onClick: handleTranspose,
      class: 'p-button-transformation'
    })
  }

  buttons.push(
    {
      icon: 'pi pi-trash',
      label: 'Delete Row',
      onClick: handleDeleteRow,
      disabled: !selectedRow.value,
      class: 'p-button-transformation'
    },
    {
      icon: 'pi pi-times',
      label: 'Delete Column',
      onClick: openDeleteDialog,
      class: 'p-button-transformation'
    }
  )

  return buttons
})

const visibleColumns = computed(() => {
  if (!data.value || data.value.length === 0) return []
  return Object.keys(data.value[0]).filter(key => key !== 'id')
})
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  background-color: var(--surface-ground);
  padding-top: 4rem; /* Add padding to account for fixed header */
}

header {
  background-color: var(--surface-0);
  border-bottom: 1px solid var(--surface-border);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

:deep(.p-menubar) {
  padding: 0.5rem 1.5rem;
  background: transparent;
  border: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

:deep(.p-menubar-end) {
  margin-left: auto;
  padding-left: 0.5rem;
}

.layout-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.layout-main {
  flex: 1;
  background-color: var(--surface-ground);
  padding: 2rem 0;
  position: relative; /* Add this to ensure proper stacking context */
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

:deep(.p-panel) {
  margin-bottom: 1.5rem;
}

:deep(.p-toolbar) {
  background: transparent;
  border: none;
  padding: 0;
}

:deep(.p-datatable) {
  border-radius: 6px;
  overflow: hidden;
}

.header-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--primary-dark);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.header-title i {
  color: var(--primary);
}

.upload-section {
  margin: 1rem 0;
}

:deep(.p-fileupload) {
  width: 100%;
}

:deep(.text-overflow-ellipsis) {
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

:deep(.p-button-transformation) {
  padding: 0.75rem 1.25rem;
  gap: 0.5rem;
  display: inline-flex;
  align-items: center;
}

:deep(.p-button-transformation .p-button-icon) {
  margin-right: 0;
}

:deep(.p-button-export) {
  gap: 0.75rem;
}

:deep(.p-button-export .p-button-icon) {
  margin-right: 0;
}

:deep(.flex.gap-4) {
  gap: 1.5rem !important;
}

:deep(.p-dropdown) {
  width: 100%;
  min-width: 0;
}

:deep(.p-dialog-custom) {
  .p-dialog-header {
    padding: 1.5rem 1.5rem 0.75rem 1.5rem;
    border-bottom: 1px solid var(--surface-border);
  }
  
  .p-dialog-content {
    padding: 0 !important;
  }

  .p-dialog-title {
    font-size: 1.25rem;
    font-weight: 600;
  }

  .p-dialog-footer {
    padding: 1rem 1.5rem;
    border-top: 1px solid var(--surface-border);
  }
}

:deep(.custom-confirm-dialog) {
  .p-dialog-header {
    padding: 1.5rem 1.5rem 0.75rem 1.5rem;
    border-bottom: 1px solid var(--surface-border);
  }
  
  .p-dialog-content {
    padding: 2rem 1.5rem !important;
  }

  .p-dialog-footer {
    padding: 1rem 1.5rem 1.5rem 1.5rem;
    border-top: 1px solid var(--surface-border);
  }

  .p-confirm-dialog-message {
    margin-left: 1.5rem;
    font-size: 1.1rem;
    color: var(--text-color);
    line-height: 1.5;
  }

  .p-confirm-dialog-icon {
    font-size: 1.75rem;
    color: var(--yellow-500);
  }

  .p-dialog-header-text {
    font-size: 1.25rem;
    font-weight: 600;
  }

  .p-dialog-footer {
    gap: 0.75rem;
    display: flex;
    justify-content: flex-end;
  }

  .p-confirm-dialog-reject {
    order: 1;
  }

  .p-confirm-dialog-accept {
    order: 2;
  }
}

.hover\:text-primary:hover {
  color: var(--primary-color);
  transition: color 0.2s;
}
</style> 