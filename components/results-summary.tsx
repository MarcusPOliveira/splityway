"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Home, Share2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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

interface PersonTotal {
  person: string
  total: number
  items: {
    name: string
    value: number
  }[]
}

export function ResultsSummary() {
  const router = useRouter()
  const [groupData, setGroupData] = useState<GroupData | null>(null)
  const [personTotals, setPersonTotals] = useState<PersonTotal[]>([])
  const [totalAmount, setTotalAmount] = useState(0)

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

    // Calculate totals per person
    calculateTotals(currentGroup)
  }, [router])

  const calculateTotals = (group: GroupData) => {
    const totals: PersonTotal[] = group.people.map((person) => ({
      person,
      total: 0,
      items: [],
    }))

    let grandTotal = 0

    // Calculate each person's share for each item
    group.items.forEach((item) => {
      grandTotal += item.totalValue

      const participantCount = item.participants.length
      if (participantCount === 0) return

      const valuePerPerson = item.totalValue / participantCount

      item.participants.forEach((participant) => {
        const personTotal = totals.find((p) => p.person === participant)
        if (personTotal) {
          personTotal.total += valuePerPerson
          personTotal.items.push({
            name: item.name,
            value: valuePerPerson,
          })
        }
      })
    })

    setPersonTotals(totals)
    setTotalAmount(grandTotal)
  }

  const handleNewGroup = () => {
    localStorage.removeItem("currentGroupId")
    router.push("/")
  }

  const handleShare = async () => {
    if (!groupData) return

    try {
      const text =
        `Divisão de conta: ${groupData.placeName}\n\n` +
        personTotals.map((p) => `${p.person}: ${formatCurrency(p.total)}`).join("\n") +
        `\n\nTotal: ${formatCurrency(totalAmount)}`

      if (navigator.share) {
        await navigator.share({
          title: `Divisão de conta: ${groupData.placeName}`,
          text,
        })
      } else {
        await navigator.clipboard.writeText(text)
        alert("Resultados copiados para a área de transferência!")
      }
    } catch (error) {
      console.error("Erro ao compartilhar:", error)
    }
  }

  if (!groupData) {
    return <div className="text-center py-8">Carregando...</div>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{groupData.placeName}</CardTitle>
          <CardDescription>Total da conta: {formatCurrency(totalAmount)}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {personTotals.map((personTotal) => (
            <Card key={personTotal.person}>
              <CardHeader className="py-4">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">{personTotal.person}</CardTitle>
                  <span className="text-lg font-bold">{formatCurrency(personTotal.total)}</span>
                </div>
              </CardHeader>
              <CardContent className="py-2">
                <div className="text-sm text-muted-foreground">
                  {personTotal.items.length > 0 ? (
                    <ul className="space-y-1">
                      {personTotal.items.map((item, index) => (
                        <li key={index} className="flex justify-between">
                          <span>{item.name}</span>
                          <span>{formatCurrency(item.value)}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>Nenhum item consumido</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button className="w-full" onClick={handleShare}>
            <Share2 className="mr-2 h-4 w-4" />
            Compartilhar Resultados
          </Button>
          <Button variant="outline" className="w-full" onClick={handleNewGroup}>
            <Home className="mr-2 h-4 w-4" />
            Nova Divisão
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
