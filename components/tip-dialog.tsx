"use client"

import { useState } from "react"
import { Percent, DollarSign } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatCurrency } from "@/lib/utils"

interface TipDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  people: string[]
  totalAmount: number
  onConfirm: (tipValue: number, participants: string[]) => void
}

export function TipDialog({
  open,
  onOpenChange,
  people,
  totalAmount,
  onConfirm,
}: TipDialogProps) {
  const [tipType, setTipType] = useState<"percentage" | "value">("percentage")
  const [percentageValue, setPercentageValue] = useState("")
  const [displayPercentage, setDisplayPercentage] = useState("")
  const [fixedValue, setFixedValue] = useState("")
  const [displayFixedValue, setDisplayFixedValue] = useState("")
  const [participants, setParticipants] = useState<string[]>(people)

  const formatPriceDisplay = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (!numbers) return ""
    const amount = Number.parseInt(numbers) / 100
    return amount.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  const handlePriceChange = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (!numbers) {
      setDisplayFixedValue("")
      setFixedValue("")
      return
    }
    const amount = Number.parseInt(numbers) / 100
    setDisplayFixedValue(formatPriceDisplay(value))
    setFixedValue(amount.toString())
  }

  const handlePercentageChange = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (!numbers) {
      setDisplayPercentage("")
      setPercentageValue("")
      return
    }
    const amount = Number.parseInt(numbers) / 100
    setDisplayPercentage(formatPriceDisplay(value))
    setPercentageValue(amount.toString())
  }

  const handleParticipantToggle = (person: string) => {
    setParticipants((prev) =>
      prev.includes(person)
        ? prev.filter((p) => p !== person)
        : [...prev, person]
    )
  }

  const handleSelectAll = () => {
    if (participants.length === people.length) {
      setParticipants([])
    } else {
      setParticipants([...people])
    }
  }

  const calculateTipValue = () => {
    if (tipType === "percentage" && percentageValue) {
      return totalAmount * (Number.parseFloat(percentageValue) / 100)
    }
    if (tipType === "value" && fixedValue) {
      return Number.parseFloat(fixedValue)
    }
    return 0
  }

  const handleConfirm = () => {
    const tipValue = calculateTipValue()
    if (tipValue > 0 && participants.length > 0) {
      onConfirm(tipValue, participants)
      handleReset()
      onOpenChange(false)
    }
  }

  const handleReset = () => {
    setPercentageValue("")
    setDisplayPercentage("")
    setFixedValue("")
    setDisplayFixedValue("")
    setParticipants(people)
    setTipType("percentage")
  }

  const tipValue = calculateTipValue()
  const isValid = tipValue > 0 && participants.length > 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Gorjeta</DialogTitle>
          <DialogDescription>
            Defina o valor ou porcentagem da gorjeta do garçom
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={tipType}
          onValueChange={(v) => setTipType(v as "percentage" | "value")}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="percentage">
              <Percent className="h-4 w-4 mr-2" />
              Porcentagem
            </TabsTrigger>
            <TabsTrigger value="value">
              <DollarSign className="h-4 w-4 mr-2" />
              Valor Fixo
            </TabsTrigger>
          </TabsList>

          <TabsContent value="percentage" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="percentage">Porcentagem (%)</Label>
              <div className="relative">
                <Input
                  id="percentage"
                  type="text"
                  inputMode="numeric"
                  placeholder="10,00"
                  value={displayPercentage}
                  onChange={(e) => handlePercentageChange(e.target.value)}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  %
                </span>
              </div>
              {percentageValue && (
                <p className="text-sm text-muted-foreground">
                  Valor da gorjeta:{" "}
                  {formatCurrency(
                    totalAmount * (Number.parseFloat(percentageValue) / 100)
                  )}
                </p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="value" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fixed-value">Valor Fixo</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  R$
                </span>
                <Input
                  id="fixed-value"
                  type="text"
                  inputMode="numeric"
                  placeholder="0,00"
                  value={displayFixedValue}
                  onChange={(e) => handlePriceChange(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label>Quem vai pagar?</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
            >
              {participants.length === people.length
                ? "Desmarcar Todos"
                : "Selecionar Todos"}
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {people.map((person) => (
              <div key={person} className="flex items-center space-x-2">
                <Checkbox
                  id={`tip-${person}`}
                  checked={participants.includes(person)}
                  onCheckedChange={() => handleParticipantToggle(person)}
                />
                <Label
                  htmlFor={`tip-${person}`}
                  className="cursor-pointer text-sm"
                >
                  {person}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {isValid && (
          <div className="bg-muted/50 p-3 rounded-lg">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Valor por pessoa:</span>
              <span className="font-medium">
                {formatCurrency(tipValue / participants.length)}
              </span>
            </div>
          </div>
        )}

        <DialogFooter className="flex mt-4 flex-col gap-4">
          <Button type="button" onClick={handleConfirm} disabled={!isValid}>
            Adicionar
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
