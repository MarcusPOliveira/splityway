"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

export function CreateGroupForm() {
  const router = useRouter()
  const [placeName, setPlaceName] = useState("")
  const [peopleCount, setPeopleCount] = useState(2)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Create group data
    const groupId = Date.now().toString()
    const groupData = {
      id: groupId,
      placeName,
      peopleCount,
      people: Array.from({ length: peopleCount }, (_, i) => `P${i + 1}`),
      items: [],
      createdAt: new Date().toISOString(),
      isFinished: false,
    }

    // Load existing groups
    const groupsJson = localStorage.getItem("groups")
    const groups = groupsJson ? JSON.parse(groupsJson) : []

    // Add new group
    groups.push(groupData)
    localStorage.setItem("groups", JSON.stringify(groups))

    // Set as current group
    localStorage.setItem("currentGroupId", groupId)

    // Navigate to orders page
    router.push("/orders")
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Novo Grupo</CardTitle>
          <CardDescription>Crie um novo grupo para dividir a conta</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="place-name">Nome do Local</Label>
            <Input
              id="place-name"
              placeholder="Ex: Bar do João"
              value={placeName}
              onChange={(e) => setPlaceName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="people-count">Quantidade de Pessoas</Label>
              <span className="text-sm font-medium">{peopleCount}</span>
            </div>
            <Slider
              id="people-count"
              min={2}
              max={20}
              step={1}
              value={[peopleCount]}
              onValueChange={(value) => setPeopleCount(value[0])}
            />
            <div className="flex items-center justify-center mt-2 text-muted-foreground">
              <Users className="h-4 w-4 mr-2" />
              <span className="text-sm">{Array.from({ length: peopleCount }, (_, i) => `P${i + 1}`).join(", ")}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={!placeName || isSubmitting}>
            {isSubmitting ? "Criando..." : "Criar Grupo"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
