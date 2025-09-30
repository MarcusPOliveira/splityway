"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PlusCircle, Receipt, ArrowLeft, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/lib/utils"

interface GroupData {
  id: string
  placeName: string
  peopleCount: number
  people: string[]
  items: OrderItem[]
  createdAt: string
  isFinished?: boolean
}

interface OrderItem {
  id: string
  name: string
  quantity: number
  totalValue: number
  participants: string[]
}

export function OrderForm() {
  const router = useRouter()
  const [groupData, setGroupData] = useState<GroupData | null>(null)
  const [itemName, setItemName] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [unitPrice, setUnitPrice] = useState("")
  const [participants, setParticipants] = useState<string[]>([])
  const [items, setItems] = useState<OrderItem[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Load group data from localStorage
    const currentGroupId = localStorage.getItem("currentGroupId")
    if (!currentGroupId) {
      router.push("/")
      return
    }

    const groupsJson = localStorage.getItem("groups")
    if (!groupsJson) {
      router.push("/")
      return
    }

    const groups: GroupData[] = JSON.parse(groupsJson)
    const currentGroup = groups.find((g) => g.id === currentGroupId)

    if (!currentGroup) {
      router.push("/")
      return
    }

    setGroupData(currentGroup)
    setItems(currentGroup.items || [])
  }, [router])

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault()

    if (!itemName || !unitPrice || participants.length === 0) return

    const totalValue = Number.parseFloat(unitPrice) * quantity

    const newItem: OrderItem = {
      id: Date.now().toString(),
      name: itemName,
      quantity,
      totalValue,
      participants: [...participants],
    }

    const updatedItems = [...items, newItem]
    setItems(updatedItems)

    // Update localStorage
    if (groupData) {
      const groupsJson = localStorage.getItem("groups")
      if (groupsJson) {
        const groups: GroupData[] = JSON.parse(groupsJson)
        const updatedGroups = groups.map((g) =>
          g.id === groupData.id ? { ...g, items: updatedItems } : g
        )
        localStorage.setItem("groups", JSON.stringify(updatedGroups))
      }
    }

    // Reset form
    setItemName("")
    setQuantity(1)
    setUnitPrice("")
    setParticipants([])
  }

  const handleRemoveItem = (id: string) => {
    const updatedItems = items.filter((item) => item.id !== id)
    setItems(updatedItems)

    // Update localStorage
    if (groupData) {
      const groupsJson = localStorage.getItem("groups")
      if (groupsJson) {
        const groups: GroupData[] = JSON.parse(groupsJson)
        const updatedGroups = groups.map((g) =>
          g.id === groupData.id ? { ...g, items: updatedItems } : g
        )
        localStorage.setItem("groups", JSON.stringify(updatedGroups))
      }
    }
  }

  const handleFinish = () => {
    setIsSubmitting(true)

    // Update localStorage and mark as finished
    if (groupData) {
      const groupsJson = localStorage.getItem("groups")
      if (groupsJson) {
        const groups: GroupData[] = JSON.parse(groupsJson)
        const updatedGroups = groups.map((g) =>
          g.id === groupData.id ? { ...g, items, isFinished: true } : g
        )
        localStorage.setItem("groups", JSON.stringify(updatedGroups))
      }
      router.push("/results")
    }
  }

  const handleParticipantToggle = (person: string) => {
    setParticipants((prev) => (prev.includes(person) ? prev.filter((p) => p !== person) : [...prev, person]))
  }

  const handleSelectAll = () => {
    if (!groupData) return

    if (participants.length === groupData.people.length) {
      setParticipants([])
    } else {
      setParticipants([...groupData.people])
    }
  }

  if (!groupData) {
    return <div className="text-center py-8">Carregando...</div>
  }

  const totalAmount = items.reduce((sum, item) => sum + item.totalValue, 0)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{groupData.placeName}</CardTitle>
          <CardDescription>
            {groupData.peopleCount} pessoas: {groupData.people.join(", ")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddItem} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="item-name">Nome do Item</Label>
              <Input
                id="item-name"
                placeholder="Ex: Pizza Margherita"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantidade</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 1)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit-price">Valor Unitário (R$)</Label>
                <Input
                  id="unit-price"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0,00"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Quem Participou?</Label>
                <Button type="button" variant="outline" size="sm" onClick={handleSelectAll}>
                  {participants.length === groupData.people.length ? "Desmarcar Todos" : "Selecionar Todos"}
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {groupData.people.map((person) => (
                  <div key={person} className="flex items-center space-x-2">
                    <Checkbox
                      id={`person-${person}`}
                      checked={participants.includes(person)}
                      onCheckedChange={() => handleParticipantToggle(person)}
                    />
                    <Label htmlFor={`person-${person}`} className="cursor-pointer">
                      {person}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {unitPrice && quantity && participants.length > 0 && (
              <Card className="bg-muted/50">
                <CardContent className="pt-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Valor total do item:</span>
                      <span className="font-medium">{formatCurrency(Number.parseFloat(unitPrice) * quantity)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Valor por participante:</span>
                      <span className="font-medium">
                        {formatCurrency((Number.parseFloat(unitPrice) * quantity) / participants.length)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Participantes:</span>
                      <span className="text-muted-foreground">{participants.length} pessoa(s)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Button type="submit" className="w-full" disabled={!itemName || !unitPrice || participants.length === 0}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Adicionar Item
            </Button>
          </form>
        </CardContent>
      </Card>

      {items.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Itens Adicionados</CardTitle>
            <CardDescription>Total: {formatCurrency(totalAmount)}</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px] pr-4">
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {item.quantity} × {formatCurrency(item.totalValue / item.quantity)} ={" "}
                          {formatCurrency(item.totalValue)}
                        </p>
                        <p className="text-xs text-muted-foreground">Para: {item.participants.join(", ")}</p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                    <Separator />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.push("/")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            <Button onClick={handleFinish} disabled={isSubmitting}>
              <Receipt className="mr-2 h-4 w-4" />
              Finalizar
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
