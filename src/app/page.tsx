"use client"

import { useState, useEffect } from 'react'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio"
import { Textarea } from "@/components/ui/textarea"


export default function Home() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [allState, setAllState] = useState<{
    [key: string]: boolean
  }>({})
  const [tv, setTv] = useState<boolean>(false)
  const [translate, setTranslate] = useState<string>('0')

  return (
    <main className="min-h-screen flex flex-col" style={ {'transform': `translate3d(0, ${translate}, 0)`} }>
      <section className="flex flex-col items-center justify-center h-screen">
        <div className="mb-20 text-center font-bold">
          <p className="mb-4 text-5xl">故鄉 KTV 巡檢表</p>
          <p className="text-3xl">每日巡檢</p>
        </div>
        <div className="mx-auto w-full max-w-[300px] space-y-6">
          <div>
            <div className="mb-2 text-2xl font-bold">選擇分店</div>
            <Select>
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
            <Input type="text" inputMode="numeric" placeholder="包廂號碼" />
          </div>
          <div>
            <div className="mb-2 text-2xl font-bold">巡包人</div>
            <Input type="text" placeholder="巡包人" />
          </div>
          <div className="text-center">
            <Button className="font-bold" onClick={() => setTranslate(`${-100 / 3}%`)}>開始巡檢</Button>
          </div>
        </div>
      </section>
      <section className="flex flex-col items-center justify-center h-screen">
        <div className="mb-20 text-center font-bold">
          <p className="text-3xl">電視機 - 前</p>
        </div>
        <div className="mx-auto w-full max-w-[300px] space-y-6">
          <div className="flex items-center space-x-4 text-xl font-bold">
            <p>是</p>
            <p>否</p>
          </div>
          <div>
            <RadioGroup className="flex items-center space-x-4">
              <RadioGroupItem value="true" id="tv-1" onClick={() => {
                allState['1'] = true
                setTv(false)
              }} />
              <RadioGroupItem value="false" id="tv-1" onClick={() => {
                allState['1'] = false
                setTv(true)
              }} />
              <label
                className="ml-3 text-xl font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                畫質是否清楚
              </label>
            </RadioGroup>
            { tv && <div className="mt-3 flex flex-wrap items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="aa" />
                <label
                  htmlFor="aa"
                  className="text-md leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  有雜訊
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="bb" />
                <label
                  htmlFor="bb"
                  className="text-md leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  有藍白線條
                </label>
              </div>
            </div> }
          </div>
          <RadioGroup className="flex items-center space-x-4">
            <RadioGroupItem value="true" id="tv-2" onClick={() => allState['2'] = true}/>
            <RadioGroupItem value="false" id="tv-2" onClick={() => allState['2'] = false}/>
            <label
              className="ml-3 text-xl font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              玻璃是否乾淨
            </label>
          </RadioGroup>
          <RadioGroup className="flex items-center space-x-4">
            <RadioGroupItem value="true" id="tv-3" onClick={() => allState['3'] = true}/>
            <RadioGroupItem value="false" id="tv-3" onClick={() => allState['3'] = true}/>
            <label
              className="ml-3 text-xl font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              散熱風扇是否有異聲
            </label>
          </RadioGroup>
          <RadioGroup className="flex items-center space-x-4">
            <RadioGroupItem value="true" id="tv-4" onClick={() => allState['4'] = true}/>
            <RadioGroupItem value="false" id="tv-4" onClick={() => allState['4'] = true}/>
            <label
              className="ml-3 text-xl font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              設定是否正常
            </label>
          </RadioGroup>
          <div className="text-center">
            <Button className="font-bold" onClick={() => {
              const temp = Object.values(allState)
              if (temp.length !== 4 || !temp.length) {
                alert('請確認所有檢核項目')
                return
              }
              setTranslate('-66%')
            }}>下一項</Button>
          </div>
        </div>
      </section>
      <section className="flex flex-col items-center justify-center h-screen">
        <div className="mx-auto w-full max-w-[300px] space-y-6">
          <div className="text-center">
            <p className="mb-2 text-2xl font-bold">其他備註</p>
            <Textarea placeholder="請輸入備註" />
          </div>
          <div className="text-center">
            <Button className="font-bold" onClick={() => {
              setTranslate('0')
              setAllState({})
            }}>送出檢核</Button>
          </div>
        </div>
      </section>
    </main>
  );
}
