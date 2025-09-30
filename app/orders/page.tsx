import { OrderForm } from "@/components/order-form"

export default function OrdersPage() {
  return (
    <div className="container max-w-md mx-auto px-4 py-8">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Lançar Pedidos</h1>
          <p className="text-muted-foreground">Adicione os itens consumidos e quem participou</p>
        </div>
        <OrderForm />
      </div>
    </div>
  )
}
