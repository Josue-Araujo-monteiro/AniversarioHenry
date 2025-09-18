"use client"

import React, { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"

interface Confirmation {
  id: string
  name: string
  will_attend: boolean
  number_of_people: number
  additional_names?: string
  people_over_6?: number
  has_children_over_6: boolean
  created_at: string
}

interface AdminSettings {
  id: string
  max_guests: number
  registration_enabled: boolean
  updated_at: string
}

export default function AdminPage() {
  const [confirmations, setConfirmations] = useState<Confirmation[]>([])
  const [settings, setSettings] = useState<AdminSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [maxGuests, setMaxGuests] = useState(100)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loginPassword, setLoginPassword] = useState("")
  const [showLogin, setShowLogin] = useState(true)
  const [loginError, setLoginError] = useState("")
  const [confirmationToDelete, setConfirmationToDelete] = useState<Confirmation | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  // Senha simples para acesso (em produção, use autenticação adequada)
  const ADMIN_PASSWORD = "Jesinha0390"

  useEffect(() => {
    if (isLoggedIn) {
      fetchData()
    }
  }, [isLoggedIn])

  const handleLogin = () => {
    if (loginPassword === ADMIN_PASSWORD) {
      setIsLoggedIn(true)
      setShowLogin(false)
      setLoginError("")
      toast({
        title: "Login realizado!",
        description: "Bem-vindo ao painel administrativo.",
      })
    } else {
      setLoginError("Senha incorreta. Tente novamente.")
      toast({
        title: "Senha incorreta",
        description: "Tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setShowLogin(true)
    setLoginPassword("")
    setLoginError("")
    setConfirmations([])
    setSettings(null)
  }

  const handleDeleteConfirmation = async () => {
    if (!confirmationToDelete) {
      console.log("Nenhuma confirmação selecionada para remoção")
      return
    }

    console.log("Iniciando remoção da confirmação:", confirmationToDelete.name)
    setIsDeleting(true)
    
    try {
      const supabase = createClient()
      console.log("Tentando remover confirmação com ID:", confirmationToDelete.id)
      
      const { error } = await supabase
        .from("confirmations")
        .delete()
        .eq("id", confirmationToDelete.id)

      if (error) {
        console.error("Erro do Supabase:", error)
        throw error
      }

      console.log("Confirmação removida com sucesso")
      toast({
        title: "Confirmação removida!",
        description: `${confirmationToDelete.name} foi removido da lista.`,
      })

      await fetchData()
      setConfirmationToDelete(null)
    } catch (error) {
      console.error("Erro ao remover confirmação:", error)
      toast({
        title: "Erro",
        description: "Não foi possível remover a confirmação",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const fetchData = async () => {
    try {
      const supabase = createClient()
      
      // Buscar confirmações
      const { data: confirmationsData, error: confirmationsError } = await supabase
        .from("confirmations")
        .select("*")
        .order("created_at", { ascending: false })

      if (confirmationsError) throw confirmationsError

      // Buscar configurações
      const { data: settingsData, error: settingsError } = await supabase
        .from("admin_settings")
        .select("*")
        .single()

      if (settingsError) throw settingsError

      setConfirmations(confirmationsData || [])
      setSettings(settingsData)
      setMaxGuests(settingsData?.max_guests || 100)
    } catch (error) {
      console.error("Erro ao buscar dados:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const updateSettings = async () => {
    if (!settings) return

    setIsUpdating(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("admin_settings")
        .update({
          max_guests: maxGuests,
          registration_enabled: settings.registration_enabled,
        })
        .eq("id", settings.id)

      if (error) throw error

      toast({
        title: "Configurações atualizadas!",
        description: "As configurações foram salvas com sucesso.",
      })

      await fetchData()
    } catch (error) {
      console.error("Erro ao atualizar configurações:", error)
      toast({
        title: "Erro",
        description: "Não foi possível atualizar as configurações",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const toggleRegistration = async () => {
    if (!settings) return

    setIsUpdating(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("admin_settings")
        .update({
          registration_enabled: !settings.registration_enabled,
        })
        .eq("id", settings.id)

      if (error) throw error

      toast({
        title: settings.registration_enabled ? "Inscrições pausadas!" : "Inscrições reativadas!",
        description: settings.registration_enabled 
          ? "As inscrições foram pausadas com sucesso." 
          : "As inscrições foram reativadas com sucesso.",
      })

      await fetchData()
    } catch (error) {
      console.error("Erro ao atualizar status das inscrições:", error)
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status das inscrições",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  // Cálculos corrigidos
  const totalGuests = confirmations
    .filter(c => c.will_attend)
    .reduce((sum, c) => {
      // Contar apenas pessoas com 6+ anos
      return sum + (c.people_over_6 || 1) // Se não tiver dados, assume 1 (pessoa principal)
    }, 0)

  const totalChildrenUnder6 = confirmations
    .filter(c => c.will_attend)
    .reduce((sum, c) => {
      const childrenUnder6 = c.number_of_people - (c.people_over_6 || 1)
      return sum + Math.max(0, childrenUnder6)
    }, 0)

  const totalPeople = totalGuests + totalChildrenUnder6

  const totalConfirmations = confirmations.filter(c => c.will_attend).length
  const totalNotAttending = confirmations.filter(c => !c.will_attend).length

  // Tela de login
  if (showLogin) {
    return (
      <div className="min-h-screen overflow-y-auto p-4" style={{ backgroundColor: "#F8FAF9" }}>
        <div className="flex items-center justify-center min-h-screen">
          <Card className="w-full max-w-md" style={{ backgroundColor: "#ECF2F2", borderColor: "#A9D2D8" }}>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl" style={{ color: "#D0AC8A" }}>
                Acesso Administrativo
              </CardTitle>
              <p style={{ color: "#5A9BA5" }}>
                Digite a senha para acessar o painel
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="password" style={{ color: "#D0AC8A" }}>
                  Senha
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={loginPassword}
                  onChange={(e) => {
                    setLoginPassword(e.target.value)
                    if (loginError) setLoginError("")
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                  placeholder="Digite a senha"
                  style={{ 
                    borderColor: loginError ? "#ef4444" : "#A9D2D8",
                    backgroundColor: loginError ? "#fef2f2" : "white"
                  }}
                />
                {loginError && (
                  <p className="text-sm mt-1" style={{ color: "#ef4444" }}>
                    {loginError}
                  </p>
                )}
              </div>
              <Button
                onClick={handleLogin}
                className="w-full"
                style={{ backgroundColor: "#FFCAAB", color: "#D0AC8A" }}
              >
                Entrar
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#F8FAF9" }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: "#A9D2D8" }}></div>
          <p style={{ color: "#D0AC8A" }}>Carregando dados...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: "#F8FAF9" }}>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2" style={{ color: "#D0AC8A" }}>
              Painel Administrativo
            </h1>
            <p className="text-lg" style={{ color: "#5A9BA5" }}>
              Gerenciar confirmações da festa do Henry
            </p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            style={{ borderColor: "#A9D2D8", color: "#D0AC8A" }}
          >
            Sair
          </Button>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card style={{ backgroundColor: "#ECF2F2", borderColor: "#A9D2D8" }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg" style={{ color: "#D0AC8A" }}>
                Pessoas 6+ anos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" style={{ color: "#5A9BA5" }}>
                {totalGuests}
              </div>
              <p className="text-sm" style={{ color: "#D0AC8A" }}>
                de {settings?.max_guests || 100} vagas
              </p>
            </CardContent>
          </Card>

          <Card style={{ backgroundColor: "#ECF2F2", borderColor: "#A9D2D8" }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg" style={{ color: "#D0AC8A" }}>
                Crianças &lt;6 anos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" style={{ color: "#5A9BA5" }}>
                {totalChildrenUnder6}
              </div>
              <p className="text-sm" style={{ color: "#D0AC8A" }}>
                crianças pequenas
              </p>
            </CardContent>
          </Card>

          <Card style={{ backgroundColor: "#ECF2F2", borderColor: "#A9D2D8" }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg" style={{ color: "#D0AC8A" }}>
                Total Confirmado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" style={{ color: "#5A9BA5" }}>
                {totalConfirmations}
              </div>
              <p className="text-sm" style={{ color: "#D0AC8A" }}>
                famílias ({totalPeople} pessoas)
              </p>
            </CardContent>
          </Card>

          <Card style={{ backgroundColor: "#ECF2F2", borderColor: "#A9D2D8" }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg" style={{ color: "#D0AC8A" }}>
                Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge 
                variant={settings?.registration_enabled ? "default" : "destructive"}
                className="text-sm"
                style={{ 
                  backgroundColor: settings?.registration_enabled ? "#5A9BA5" : "#ef4444",
                  color: "white"
                }}
              >
                {settings?.registration_enabled ? "Ativo" : "Pausado"}
              </Badge>
              <p className="text-xs mt-1" style={{ color: "#D0AC8A" }}>
                {totalNotAttending} não vão
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Configurações */}
        <Card style={{ backgroundColor: "#ECF2F2", borderColor: "#A9D2D8" }}>
          <CardHeader>
            <CardTitle style={{ color: "#D0AC8A" }}>Configurações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="maxGuests" className="text-base" style={{ color: "#D0AC8A" }}>
                  Limite de Convidados
                </Label>
                <p className="text-sm" style={{ color: "#5A9BA5" }}>
                  Número máximo de pessoas que podem se inscrever
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  id="maxGuests"
                  type="number"
                  min="1"
                  value={maxGuests}
                  onChange={(e) => setMaxGuests(parseInt(e.target.value) || 100)}
                  className="w-24"
                  style={{ borderColor: "#A9D2D8" }}
                />
                <Button
                  onClick={updateSettings}
                  disabled={isUpdating}
                  style={{ backgroundColor: "#FFCAAB", color: "#D0AC8A" }}
                >
                  {isUpdating ? "Salvando..." : "Salvar"}
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base" style={{ color: "#D0AC8A" }}>
                  Status das Inscrições
                </Label>
                <p className="text-sm" style={{ color: "#5A9BA5" }}>
                  Pausar ou reativar as inscrições
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={settings?.registration_enabled || false}
                  onCheckedChange={toggleRegistration}
                  disabled={isUpdating}
                />
                <span className="text-sm" style={{ color: "#D0AC8A" }}>
                  {settings?.registration_enabled ? "Ativo" : "Pausado"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Confirmações */}
        <Card style={{ backgroundColor: "#ECF2F2", borderColor: "#A9D2D8" }}>
          <CardHeader>
            <CardTitle style={{ color: "#D0AC8A" }}>
              Confirmações ({confirmations.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {confirmations.length === 0 ? (
              <p className="text-center py-8" style={{ color: "#5A9BA5" }}>
                Nenhuma confirmação ainda
              </p>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin' }}>
                {confirmations.map((confirmation) => (
                  <div
                    key={confirmation.id}
                    className="p-4 rounded-lg border"
                    style={{ 
                      backgroundColor: confirmation.will_attend ? "#F8FAF9" : "#fef2f2",
                      borderColor: confirmation.will_attend ? "#A9D2D8" : "#fecaca"
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold" style={{ color: "#D0AC8A" }}>
                          {confirmation.name}
                        </h3>
                        {confirmation.will_attend && (
                          <div className="mt-1 space-y-1">
                            <p className="text-sm" style={{ color: "#5A9BA5" }}>
                              {confirmation.number_of_people} pessoa{confirmation.number_of_people > 1 ? 's' : ''}
                              {confirmation.additional_names && ` (${confirmation.additional_names})`}
                            </p>
                            <div className="flex flex-wrap gap-1">
                              <Badge 
                                variant="default" 
                                className="text-xs"
                                style={{ 
                                  backgroundColor: "#5A9BA5",
                                  color: "white"
                                }}
                              >
                                {confirmation.people_over_6 || 1} pessoa{(confirmation.people_over_6 || 1) > 1 ? 's' : ''} 6+ anos
                              </Badge>
                              {(confirmation.number_of_people - (confirmation.people_over_6 || 1)) > 0 && (
                                <Badge 
                                  variant="secondary" 
                                  className="text-xs"
                                  style={{ 
                                    backgroundColor: "#94a3b8",
                                    color: "white"
                                  }}
                                >
                                  {(confirmation.number_of_people - (confirmation.people_over_6 || 1))} criança{(confirmation.number_of_people - (confirmation.people_over_6 || 1)) > 1 ? 's' : ''} &lt;6 anos
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="text-right ml-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge 
                            variant={confirmation.will_attend ? "default" : "destructive"}
                            style={{ 
                              backgroundColor: confirmation.will_attend ? "#5A9BA5" : "#ef4444",
                              color: "white"
                            }}
                          >
                            {confirmation.will_attend ? "Confirmado" : "Não vai"}
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              console.log("Botão remover clicado para:", confirmation.name)
                              setConfirmationToDelete(confirmation)
                            }}
                            style={{ 
                              borderColor: "#ef4444", 
                              color: "#ef4444",
                              fontSize: "12px",
                              padding: "4px 8px"
                            }}
                          >
                            Remover
                          </Button>
                        </div>
                        <p className="text-xs" style={{ color: "#5A9BA5" }}>
                          {new Date(confirmation.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modal de confirmação de remoção */}
      <AlertDialog open={!!confirmationToDelete} onOpenChange={() => setConfirmationToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle style={{ color: "#D0AC8A" }}>
              Confirmar Remoção
            </AlertDialogTitle>
            <AlertDialogDescription style={{ color: "#5A9BA5" }}>
              Tem certeza que deseja remover a confirmação de <strong>{confirmationToDelete?.name}</strong>?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={() => setConfirmationToDelete(null)}
              style={{ borderColor: "#A9D2D8", color: "#D0AC8A" }}
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirmation}
              disabled={isDeleting}
              style={{ 
                backgroundColor: "#ef4444", 
                color: "white",
                opacity: isDeleting ? 0.7 : 1
              }}
            >
              {isDeleting ? "Removendo..." : "Remover"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
