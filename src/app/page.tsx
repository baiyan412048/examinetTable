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

  const [loading, setLoading] = useState(true)

  const [main, setMain] = useState<{
    id: number,
    name: string,
    normal: string,
    abnormal: string,
    option: string[]
  }[]>([])

  const [allState, setAllState] = useState<{
    [key: number]: {
      title: string
      state: boolean
      stateName: string
      note?: string[]
    }
  }>({})
  const addKeyToAllState = (key: number, value: {
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

  const getQuestion = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/question/date')
      const { data } = await res.json()
      if (!data.length) {
        throw new Error('無法獲取題目資料')
      }

      console.log(data)

      const main = (data as {
        id: number,
        name: string,
        normal: string,
        abnormal: string,
        option: string
      }[]).map((item) => ({
        ...item,
        option: item.option.split(',') ?? []
      }))
      setMain(main)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const postReport = async () => {
    try {
      await fetch(`http://localhost:8080/api/report/${tableInfo.branch}/${tableInfo.box}/daily`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          info: [tableInfo],
          report: Object.values(allState).map((item) => ({
            ...item,
            note: item.note?.join()
          }))
        })
      })
      alert('已成功送出表單')
      addNewTranslate('0')
      setAllState({})
      addToTableInfo({
        branch: '',
        box: '',
        person: ''
      })
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    getQuestion()
  }, []);

  return (
    loading ? <div>LOADING</div> : <main className="min-h-dvh flex flex-col" style={ {'transform': `translate3d(0, ${translate}, 0)`} }>
      <section className="flex flex-col items-center justify-center h-dvh p-6">
        <div className="mb-20 text-center font-bold">
          <p className="mb-4 text-5xl">故鄉 KTV 巡檢表</p>
          <p className="text-3xl">每日巡檢</p>
        </div>
        <div className="mx-auto w-full max-w-[400px] space-y-6">
          <div>
            <div className="mb-2 text-2xl font-bold">選擇分店</div>
            <Select value={tableInfo.branch} onValueChange={(value) => addKeyToTableInfo('branch', value)}>
              <SelectTrigger>
                <SelectValue placeholder="選擇分店" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="Hanxi">旱溪店</SelectItem>
                  <SelectItem value="Dali">大里店</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            <div className="mb-2 text-2xl font-bold">包廂號碼</div>
            <Input value={tableInfo.box} onBlur={() => window.scrollTo(0, 0)} onInput={(event) => addKeyToTableInfo('box', (event.target as HTMLInputElement).value)} type="text" inputMode="numeric" placeholder="包廂號碼" />
          </div>
          <div>
            <div className="mb-2 text-2xl font-bold">巡包人</div>
            <Input value={tableInfo.person} onBlur={() => window.scrollTo(0, 0)} onInput={(event) => addKeyToTableInfo('person', (event.target as HTMLInputElement).value)} type="text" placeholder="巡包人" />
          </div>
          <div className="text-center">
            <Button className="font-bold" onClick={() => {
              if (!tableInfo.branch || !tableInfo.box || !tableInfo.person) {
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
          <section key={item.id} className="flex flex-col items-center justify-center p-6 h-dvh">
            <div className="mb-10 text-center font-bold">
              <p className="text-3xl">{item.name}</p>
            </div>
            <div className="mx-auto mb-20 w-full max-w-[400px] space-y-6">
              <div>
                <RadioGroup className="flex justify-center space-x-6" value={allState[item.id] ? allState[item.id].state ? 'normal' : 'abnormal' : undefined}>
                  <Label className='flex space-x-2'>
                    <RadioGroupItem value="normal" onClick={() => addKeyToAllState(item.id, {
                      title: item.name,
                      state: true,
                      stateName: item.normal,
                      note: []
                    })} />
                    <span>{item.normal}</span>
                  </Label>
                  <Label className='flex space-x-2'>
                    <RadioGroupItem value="abnormal" onClick={() => addKeyToAllState(item.id, {
                      title: item.name,
                      state: false,
                      stateName: item.abnormal,
                      note: allState[item.id]?.note
                    })} />
                    <span>{item.abnormal}</span>
                  </Label>
                </RadioGroup>
                {
                  (item.option.length && (allState[item.id]?.state !== undefined ? !allState[item.id].state : false)) && <div className="mt-6 space-y-4">
                    <p className='text-xl'>異常問題 :</p>
                    {
                      item.option.map((option, index) => (
                        <div key={`選項${index}${option}`} className="space-y-4">
                          { option === '其他' ? <Textarea placeholder="如異常狀況為其他問題，請輸入問題描述。" /> : <Label className='flex space-x-2'>
                              <Checkbox checked={allState[item.id]?.note?.includes(option)}  onCheckedChange={(value) => {
                                const note = allState[item.id]?.note?.slice() ?? []
                                if (value) {
                                  note?.push(option)
                                } else {
                                  const index = note?.findIndex((target) => target === option)
                                  index !== undefined && note?.splice(index, 1)
                                }
                                addKeyToAllState(item.id, {
                                  title: item.name,
                                  state: false,
                                  stateName: item.abnormal,
                                  note
                                })
                              }}/>
                              <span>{option}</span>
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
                if (allState[item.id] === undefined) {
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
            <Button className="font-bold" onClick={() => postReport()}>送出表單</Button>
          </div>
        </div>
      </section>
    </main>
  )
}
