import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface TranslateState {
  translate: string
  addNewTranslate: (translate: string) => void
}

export const useTranslateStore = create<TranslateState>()(
  persist(
    (set) => ({
      translate: '0',
      addNewTranslate: (translate) =>
        set(() => {
          return { translate }
        })
    }),
    {
      name: 'translate',
      storage: createJSONStorage(() => sessionStorage)
    }
  )
)

interface TableInfoState {
  tableInfo: {
    [key: string]: string | undefined
  }
  addToTableInfo: (tableInfo: {
    [key: string]: string | undefined
  }) => void
}

export const useTableInfoStore = create<TableInfoState>()(
  persist(
    (set) => ({
      tableInfo: {},
      addToTableInfo: (tableInfo) =>
        set(() => {
          const temp = {
            ...tableInfo
          }
          return { tableInfo: temp }
        })
    }),
    {
      name: 'translate',
      storage: createJSONStorage(() => sessionStorage)
    }
  )
)
