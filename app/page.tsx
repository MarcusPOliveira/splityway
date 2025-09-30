"use client"

import Link from "next/link"
import { History } from "lucide-react"
import { CreateGroupForm } from "@/components/create-group-form"
import { OpenGroupsList } from "@/components/open-groups-list"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import { ThemeSwitcher } from "@/components/theme-switcher"

export default function Home() {
  return (
    <div className="container max-w-md mx-auto px-4 py-8">
      <div className="space-y-6">
        <div className="flex justify-end">
          <ThemeSwitcher />
        </div>
        <div className="text-center space-y-2 items-center flex flex-col">
          <Logo />
          <p className="text-muted-foreground">
            Crie um grupo e divida as contas facilmente entre amigos
          </p>
        </div>
        <CreateGroupForm />
        <OpenGroupsList />
        <Link href="/history">
          <Button variant="outline" className="w-full mt-6">
            <History className="mr-2 h-4 w-4" />
            Ver Histórico de Grupos
          </Button>
        </Link>
      </div>
    </div>
  )
}
