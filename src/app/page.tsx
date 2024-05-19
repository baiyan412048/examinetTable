'use client'

import { useState, useEffect } from 'react'
import useGoogleSheets from 'use-google-sheets';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio"
import { Textarea } from "@/components/ui/textarea"
import { useTranslateStore, useTableInfoStore } from '@/lib/zustand'


export default function Home() {
  const { translate, addNewTranslate } = useTranslateStore()
  const { tableInfo, addToTableInfo } = useTableInfoStore()

  const [allState, setAllState] = useState<{
    [key: string]: {
      title: string
      state: boolean
      stateName: string
      note?: string[]
    }
  }>({})
  const addKeyToAllState = (key: string, value: {
    title: string
    state: boolean
    stateName: string
    note?: string[]
  }) => {
    setAllState((prevState) => ({
      ...prevState,
      [key]: value
    }))
  }

  const addKeyToTableInfo = (key: string, value: string) => {
    addToTableInfo({
      ...tableInfo,
      [key]: value
    })
  }

  const [main, setMain] = useState<{
    '編號': string
    '問題類型': '主要問題',
    '選項類型': '單選',
    '問題名稱': string,
    '正常選項名稱': string,
    '異常選項名稱': string,
    '異常問題細項': string[]
  }[]>([])
  const [sub, setSub] = useState<{
    '編號': string
    '問題類型': '從屬問題'
    '選項類型': '多選' | '多選含輸入備註'
    '問題名稱': string
  }[]>([])

  const { data, loading, error } = useGoogleSheets({
    apiKey: process.env.GOOGLE_API_KEY ?? 'AIzaSyCWxiZMVqH1h94h73QL4evSRFvKFnv15mU',
    sheetId: process.env.GOOGLE_SHEET_ID ?? '1EOQ3luyQvq38F4bJYWpUiDeUr8JPbmUxlKwosPsWOeE',
  });

  useEffect(() => {
    if (data.length) {
      const sheetData = data[0] as unknown as {
        data: {
          '編號': string
          '問題類型': '主要問題' | '從屬問題'
          '選項類型': '單選' | '多選' | '多選含輸入備註'
          '問題名稱': string
          '正常選項名稱'?: string
          '異常選項名稱'?: string
          '異常問題細項'?: string
        }[]
      }
      console.log(sheetData, 'sheetData')
      const tempMain = sheetData.data.filter((item) => item['問題類型'] === '主要問題') as {
        '編號': string
        '問題類型': '主要問題'
        '選項類型': '單選'
        '問題名稱': string
        '正常選項名稱'?: string
        '異常選項名稱'?: string
        '異常問題細項'?: string
      }[]
      const main = tempMain.map((item) => ({
        ...item,
        '問題名稱': item['問題名稱'].replace(/[\r\n]+/g, ''),
        '正常選項名稱': item['正常選項名稱'] ?? '正常',
        '異常選項名稱': item['異常選項名稱'] ?? '異常',
        '異常問題細項': item['異常問題細項']?.split(',') ?? []
      }))
      setMain(main)

      const sub = sheetData.data.filter((item) => item['問題類型'] === '從屬問題') as {
        '編號': string
        '問題類型': '從屬問題'
        '選項類型': '多選' | '多選含輸入備註'
        '問題名稱': string
      }[]
      setSub(sub)
    }
  }, [data]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    loading ? <div>LOADING</div> : error ? <div>{JSON.stringify(error)}</div> : <main className="min-h-dvh flex flex-col" style={ {'transform': `translate3d(0, ${translate}, 0)`} }>
      <section className="flex flex-col items-center justify-center h-dvh p-6">
        <div className="mb-20 text-center font-bold">
          <p className="mb-4 text-5xl">故鄉 KTV 巡檢表</p>
          <p className="text-3xl">每日巡檢</p>
        </div>
        <div className="mx-auto w-full max-w-[400px] space-y-6">
          <div>
            <div className="mb-2 text-2xl font-bold">選擇分店</div>
            <Select value={tableInfo['分店']} onValueChange={(value) => addKeyToTableInfo('分店', value)}>
              <SelectTrigger>
                <SelectValue placeholder="選擇分店" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="旱溪店">旱溪店</SelectItem>
                  <SelectItem value="大里店">大里店</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            <div className="mb-2 text-2xl font-bold">包廂號碼</div>
            <Input value={tableInfo['包廂號碼']} onBlur={() => window.scrollTo(0, 0)} onInput={(event) => addKeyToTableInfo('包廂號碼', (event.target as HTMLInputElement).value)} type="text" inputMode="numeric" placeholder="包廂號碼" />
          </div>
          <div>
            <div className="mb-2 text-2xl font-bold">巡包人</div>
            <Input value={tableInfo['巡包人']} onBlur={() => window.scrollTo(0, 0)} onInput={(event) => addKeyToTableInfo('巡包人', (event.target as HTMLInputElement).value)} type="text" placeholder="巡包人" />
          </div>
          <div className="text-center">
            <Button className="font-bold" onClick={() => {
              if (!tableInfo['分店'] || !tableInfo['包廂號碼'] || !tableInfo['巡包人']) {
                alert('請完整填寫巡檢表資訊')
                return
              }
              addNewTranslate('-100dvh')
            }}>開始巡檢</Button>
          </div>
        </div>
      </section>
      {
        main.map((item, index) => (
          <section key={item['編號']} className="flex flex-col items-center justify-center p-6 h-dvh">
            <div className="mb-10 text-center font-bold">
              <p className="text-3xl">{item['問題名稱']}</p>
            </div>
            <div className="mx-auto mb-20 w-full max-w-[400px] space-y-6">
              <div>
                <RadioGroup className="flex justify-center space-x-6" value={allState[item['編號']] ? allState[item['編號']].state ? 'normal' : 'abnormal' : undefined}>
                  <Label className='flex space-x-2'>
                    <RadioGroupItem value="normal" onClick={() => addKeyToAllState(item['編號'], {
                      title: item['問題名稱'],
                      state: true,
                      stateName: item['正常選項名稱'],
                      note: []
                    })} />
                    <span>{item['正常選項名稱']}</span>
                  </Label>
                  <Label className='flex space-x-2'>
                    <RadioGroupItem value="abnormal" onClick={() => addKeyToAllState(item['編號'], {
                      title: item['問題名稱'],
                      state: false,
                      stateName: item['異常選項名稱'],
                      note: allState[item['編號']]?.note
                    })} />
                    <span>{item['異常選項名稱']}</span>
                  </Label>
                </RadioGroup>
                {
                  (item['異常問題細項'].length && (allState[item['編號']]?.state !== undefined ? !allState[item['編號']].state : false)) && <div className="mt-6 space-y-4">
                    <p className='text-xl'>異常問題 :</p>
                    {
                      sub.filter((tempSub) => item['異常問題細項'].includes(tempSub['編號'])).map((tempSub, index) => (
                        <div key={`選項${index}${tempSub['問題名稱']}`} className="space-y-4">
                          { tempSub['選項類型'] === '多選含輸入備註' ? <Textarea placeholder="如異常狀況為其他問題，請輸入問題描述。" /> : <Label className='flex space-x-2'>
                              <Checkbox checked={allState[item['編號']]?.note?.includes(tempSub['問題名稱'])}  onCheckedChange={(value) => {
                                const note = allState[item['編號']]?.note?.slice() ?? []
                                if (value) {
                                  note?.push(tempSub['問題名稱'])
                                } else {
                                  const index = note?.findIndex((target) => target === tempSub['問題名稱'])
                                  index !== undefined && note?.splice(index, 1)
                                }
                                addKeyToAllState(item['編號'], {
                                  title: item['問題名稱'],
                                  state: false,
                                  stateName: item['異常選項名稱'],
                                  note
                                })
                              }}/>
                              <span>{tempSub['問題名稱']}</span>
                            </Label>
                          }
                        </div>
                      ))
                    }
                  </div>
                }
              </div>
            </div>
            <div className="text-center space-x-4">
              <Button className="font-bold" variant="outline" onClick={() => {
                addNewTranslate(`${-100 * index}dvh`)
              }}>上一步</Button>
              <Button className="font-bold" onClick={() => {
                if (allState[item['編號']] === undefined) {
                  alert('請確認所有檢核項目')
                  return
                }
                addNewTranslate(`${-100 * (index + 2)}dvh`)
              }}>下一步</Button>
            </div>
          </section>
        ))
      }
      <section className="flex flex-col items-center justify-center h-dvh p-6">
        <div className="mx-auto w-full max-w-[400px]">
          <div className="mb-10 text-center font-bold">
            <p className="text-3xl">確認巡檢內容</p>
          </div>
          <div className='text-xl border border-current-300 rounded mb-20 h-[40dvh] overflow-auto'>{
            Object.values(allState).map((item) => {
              return (
                <div className='p-3 border-b border-current-300 last:border-none' key={item.title}>
                  <p>檢核項目：<span>{item.title}</span></p>
                  <p>檢核狀態：<span className={item.state ? 'font-bold' : 'font-bold text-red-500'}>{item.stateName}</span></p>
                  {
                    (item.note && (item.note.length > 0)) && <p className="space-x-2">異常項目：{
                      item.note?.map((note) => {
                        return <span key={note}>{ note }</span>
                      })
                    }</p>
                  }
                </div>
              )
            })
          }</div>
          <div className="text-center space-x-4">
            <Button className="font-bold" variant="outline" onClick={() => {
              addNewTranslate(`${-100 * main.length}dvh`)
            }}>上一步</Button>
            <Button className="font-bold" onClick={() => {
              fetch('http://localhost:3000/api/test', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  report: Object.values(allState)
                })
              })
              addNewTranslate('0')
              setAllState({})
              addToTableInfo({})
            }}>送出表單</Button>
          </div>
        </div>
      </section>
    </main>
  )
}
