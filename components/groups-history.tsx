"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Calendar, Users, Eye, ChevronDown, ChevronUp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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

interface PersonTotal {
  person: string
  total: number
  items: {
    name: string
    value: number
  }[]
}

export function GroupsHistory() {
  const router = useRouter()
  const [finishedGroups, setFinishedGroups] = useState<GroupData[]>([])
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())

  useEffect(() => {
    loadFinishedGroups()
  }, [])

  const loadFinishedGroups = () => {
    const groupsJson = localStorage.getItem("groups")
    if (!groupsJson) {
      setFinishedGroups([])
      return
    }

    const groups: GroupData[] = JSON.parse(groupsJson)
    const finished = groups.filter((group) => group.isFinished)
    // Sort by date, most recent first
    finished.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    setFinishedGroups(finished)
  }

  const handleViewResults = (groupId: string) => {
    localStorage.setItem("currentGroupId", groupId)
    router.push("/results")
  }

  const toggleExpanded = (groupId: string) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(groupId)) {
        newSet.delete(groupId)
      } else {
        newSet.add(groupId)
      }
      return newSet
    })
  }

  const calculateGroupTotal = (group: GroupData) => {
    return group.items.reduce((sum, item) => sum + item.totalValue, 0)
  }

  const calculatePersonTotals = (group: GroupData): PersonTotal[] => {
    const totals: PersonTotal[] = group.people.map((person) => ({
      person,
      total: 0,
      items: [],
    }))

    group.items.forEach((item) => {
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

    return totals
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (finishedGroups.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Nenhum grupo finalizado ainda
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {finishedGroups.map((group, index) => {
          const isExpanded = expandedGroups.has(group.id)
          const personTotals = calculatePersonTotals(group)
          const totalAmount = calculateGroupTotal(group)

          return (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="border-2">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle>{group.placeName}</CardTitle>
                      <CardDescription>
                        <div className="flex items-center gap-3 text-xs">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(group.createdAt)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            <span>{group.peopleCount} pessoas</span>
                          </div>
                        </div>
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Total</p>
                      <p className="text-lg font-bold">
                        {formatCurrency(totalAmount)}
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="text-sm text-muted-foreground">
                    {group.items.length} item(ns) · {group.people.join(", ")}
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4 pt-2"
                      >
                        <Separator />

                        <div>
                          <h4 className="font-semibold text-sm mb-2">
                            Itens Consumidos
                          </h4>
                          <div className="space-y-2">
                            {group.items.map((item) => (
                              <div key={item.id} className="text-sm">
                                <div className="flex justify-between">
                                  <span className="font-medium">
                                    {item.name}
                                  </span>
                                  <span>{formatCurrency(item.totalValue)}</span>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {item.quantity} ×{" "}
                                  {formatCurrency(
                                    item.totalValue / item.quantity
                                  )}{" "}
                                  · Para: {item.participants.join(", ")}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <Separator />

                        <div>
                          <h4 className="font-semibold text-sm mb-2">
                            Divisão por Pessoa
                          </h4>
                          <div className="space-y-2">
                            {personTotals.map((personTotal) => (
                              <div key={personTotal.person} className="text-sm">
                                <div className="flex justify-between items-center">
                                  <span className="font-medium">
                                    {personTotal.person}
                                  </span>
                                  <span className="font-bold">
                                    {formatCurrency(personTotal.total)}
                                  </span>
                                </div>
                                {personTotal.items.length > 0 && (
                                  <div className="text-xs text-muted-foreground ml-2">
                                    {personTotal.items.map((item, index) => (
                                      <div key={index}>
                                        • {item.name}:{" "}
                                        {formatCurrency(item.value)}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="grid grid-cols-1 sm:grid-cols-2 pt-2 gap-2">
                    <Button
                      variant="outline"
                      size="default"
                      onClick={() => toggleExpanded(group.id)}
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="h-4 w-4 mr-2" />
                          Ocultar Detalhes
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-4 w-4 mr-2" />
                          Ver Detalhes
                        </>
                      )}
                    </Button>
                    <Button
                      size="default"
                      onClick={() => handleViewResults(group.id)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Resultados
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
