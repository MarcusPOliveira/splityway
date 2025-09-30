"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { OrderForm } from "@/components/order-form"
import { Button } from "@/components/ui/button"

export default function OrdersPage() {
  return (
    <div className="container max-w-md mx-auto px-4 py-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Lançar Pedidos</h1>
            <p className="text-muted-foreground">Adicione os itens consumidos e quem participou</p>
          </div>
          <Link href="/">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <OrderForm />
      </div>
    </div>
  )
}
