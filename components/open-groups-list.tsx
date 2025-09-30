"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Edit, CheckCircle, Calendar, Users } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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

export function OpenGroupsList() {
  const router = useRouter()
  const [openGroups, setOpenGroups] = useState<GroupData[]>([])

  useEffect(() => {
    loadOpenGroups()
  }, [])

  const loadOpenGroups = () => {
    const groupsJson = localStorage.getItem("groups")
    if (!groupsJson) {
      setOpenGroups([])
      return
    }

    const groups: GroupData[] = JSON.parse(groupsJson)
    const open = groups.filter((group) => !group.isFinished)
    setOpenGroups(open)
  }

  const handleEditGroup = (groupId: string) => {
    // Set as current group
    localStorage.setItem("currentGroupId", groupId)
    router.push("/orders")
  }

  const handleFinishGroup = (groupId: string) => {
    const groupsJson = localStorage.getItem("groups")
    if (!groupsJson) return

    const groups: GroupData[] = JSON.parse(groupsJson)
    const updatedGroups = groups.map((group) =>
      group.id === groupId ? { ...group, isFinished: true } : group
    )

    localStorage.setItem("groups", JSON.stringify(updatedGroups))

    // Set as current group and navigate to results
    localStorage.setItem("currentGroupId", groupId)
    router.push("/results")
  }

  const calculateGroupTotal = (group: GroupData) => {
    return group.items.reduce((sum, item) => sum + item.totalValue, 0)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  if (openGroups.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Grupos em Aberto</CardTitle>
        <CardDescription>Continue editando ou finalize um grupo existente</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <AnimatePresence mode="popLayout">
          {openGroups.map((group, index) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="border-2">
            <CardContent className="pt-4">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg">{group.placeName}</h3>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(group.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{group.peopleCount} pessoas</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-lg font-bold">{formatCurrency(calculateGroupTotal(group))}</p>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  {group.items.length === 0 ? (
                    <p>Nenhum item adicionado ainda</p>
                  ) : (
                    <p>{group.items.length} item(ns) adicionado(s)</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEditGroup(group.id)}>
                    <Edit className="h-3 w-3 mr-1" />
                    Editar
                  </Button>
                  <Button size="sm" className="flex-1" onClick={() => handleFinishGroup(group.id)}>
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Finalizar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}