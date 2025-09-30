"use client"

import Link from "next/link"
import { History } from "lucide-react"
import { motion } from "framer-motion"
import { CreateGroupForm } from "@/components/create-group-form"
import { OpenGroupsList } from "@/components/open-groups-list"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import { ThemeSwitcher } from "@/components/theme-switcher"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
}

export default function Home() {
  return (
    <div className="container max-w-md mx-auto px-4 py-8">
      <motion.div
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="flex justify-end" variants={itemVariants}>
          <ThemeSwitcher />
        </motion.div>
        <motion.div
          className="text-center space-y-2 items-center flex flex-col"
          variants={itemVariants}
        >
          <Logo />
          <p className="text-muted-foreground">
            Crie um grupo e divida as contas facilmente entre amigos
          </p>
        </motion.div>
        <motion.div variants={itemVariants}>
          <CreateGroupForm />
        </motion.div>
        <motion.div variants={itemVariants}>
          <OpenGroupsList />
        </motion.div>
        <motion.div variants={itemVariants}>
          <Link href="/history">
            <Button variant="outline" className="w-full mt-6">
              <History className="mr-2 h-4 w-4" />
              Ver Histórico de Grupos
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}
