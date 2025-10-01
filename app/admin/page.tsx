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

interface Gift {
  id: string
  name: string
  description?: string
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export default function AdminPage() {
  const [confirmations, setConfirmations] = useState<Confirmation[]>([])
  const [settings, setSettings] = useState<AdminSettings | null>(null)
  const [gifts, setGifts] = useState<Gift[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [maxGuests, setMaxGuests] = useState(100)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loginPassword, setLoginPassword] = useState("")
  const [showLogin, setShowLogin] = useState(true)
  const [loginError, setLoginError] = useState("")
  const [confirmationToDelete, setConfirmationToDelete] = useState<Confirmation | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showGiftsModal, setShowGiftsModal] = useState(false)
  const [editingGift, setEditingGift] = useState<Gift | null>(null)
  const [newGiftName, setNewGiftName] = useState("")
  const [newGiftDescription, setNewGiftDescription] = useState("")
  const { toast } = useToast()

  // Senha simples para acesso (em produção, use autenticação adequada)
  const ADMIN_PASSWORD = "Jesinha0390"

  useEffect(() => {
    if (isLoggedIn) {
      fetchData()
    }
    
    // Forçar remoção do position: fixed do body
    const body = document.body
    if (body) {
      body.style.position = 'static'
      body.style.top = 'auto'
      body.style.left = 'auto'
      body.style.overflow = 'auto'
      body.style.height = 'auto'
      body.style.minHeight = '100vh'
    }
    
    return () => {
      // Restaurar estilos quando sair da página
      if (body) {
        body.style.position = ''
        body.style.top = ''
        body.style.left = ''
        body.style.overflow = ''
        body.style.height = ''
        body.style.minHeight = ''
      }
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

  const handleAddGift = async () => {
    if (!newGiftName.trim()) return

    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("gifts")
        .insert({
          name: newGiftName.trim(),
          description: newGiftDescription.trim() || null,
          sort_order: gifts.length + 1,
        })
        .select()
        .single()

      if (error) throw error

      setGifts(prev => [...prev, data])
      setNewGiftName("")
      setNewGiftDescription("")
      
      toast({
        title: "Presente adicionado!",
        description: "O presente foi adicionado à lista.",
      })
    } catch (error) {
      console.error("Erro ao adicionar presente:", error)
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o presente",
        variant: "destructive",
      })
    }
  }

  const handleUpdateGift = async (gift: Gift) => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("gifts")
        .update({
          name: gift.name,
          description: gift.description,
          is_active: gift.is_active,
        })
        .eq("id", gift.id)

      if (error) throw error

      setGifts(prev => prev.map(g => g.id === gift.id ? gift : g))
      
      toast({
        title: "Presente atualizado!",
        description: "As alterações foram salvas.",
      })
    } catch (error) {
      console.error("Erro ao atualizar presente:", error)
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o presente",
        variant: "destructive",
      })
    }
  }

  const handleDeleteGift = async (giftId: string) => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("gifts")
        .delete()
        .eq("id", giftId)

      if (error) throw error

      setGifts(prev => prev.filter(g => g.id !== giftId))
      
      toast({
        title: "Presente removido!",
        description: "O presente foi removido da lista.",
      })
    } catch (error) {
      console.error("Erro ao remover presente:", error)
      toast({
        title: "Erro",
        description: "Não foi possível remover o presente",
        variant: "destructive",
      })
    }
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
      
      // Primeiro, vamos verificar se a confirmação existe
      const { data: existingConfirmation, error: fetchError } = await supabase
        .from("confirmations")
        .select("id, name")
        .eq("id", confirmationToDelete.id)
        .single()

      if (fetchError) {
        console.error("Erro ao buscar confirmação:", fetchError)
        throw new Error("Confirmação não encontrada")
      }

      console.log("Confirmação encontrada:", existingConfirmation)

      // Agora vamos deletar
      const { error: deleteError } = await supabase
        .from("confirmations")
        .delete()
        .eq("id", confirmationToDelete.id)

      if (deleteError) {
        console.error("Erro do Supabase ao deletar:", deleteError)
        throw deleteError
      }

      console.log("Confirmação removida com sucesso do banco")
      
      // Atualizar a lista local imediatamente
      setConfirmations(prev => prev.filter(c => c.id !== confirmationToDelete.id))
      
      toast({
        title: "Confirmação removida!",
        description: `${confirmationToDelete.name} foi removido da lista.`,
      })

      // Fechar o modal
      setConfirmationToDelete(null)
    } catch (error) {
      console.error("Erro ao remover confirmação:", error)
      toast({
        title: "Erro",
        description: `Não foi possível remover a confirmação: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
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

      // Buscar configurações (pegar o primeiro registro se houver múltiplos)
      const { data: settingsData, error: settingsError } = await supabase
        .from("admin_settings")
        .select("*")
        .order("created_at", { ascending: true })
        .limit(1)
        .single()

      if (settingsError) throw settingsError

      // Buscar presentes
      const { data: giftsData, error: giftsError } = await supabase
        .from("gifts")
        .select("*")
        .order("sort_order", { ascending: true })

      if (giftsError) throw giftsError

      setConfirmations(confirmationsData || [])
      setSettings(settingsData)
      setGifts(giftsData || [])
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

  // Função para gerar e baixar PDF da lista de convidados
  const downloadGuestListPDF = (sortAlphabetically = false) => {
    try {
      // Filtrar apenas convidados confirmados
      let attendingGuests = confirmations.filter(c => c.will_attend)
      
      // Ordenar alfabeticamente se solicitado
      if (sortAlphabetically) {
        attendingGuests = attendingGuests.sort((a, b) => 
          a.name.toLowerCase().localeCompare(b.name.toLowerCase(), 'pt-BR')
        )
      }
      
      // Criar conteúdo HTML para o PDF
      let htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Lista de Convidados - Aniversário do Henry</title>
          <style>
            @page {
              size: A4;
              margin: 1cm;
            }
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 20px;
              color: #333;
              line-height: 1.4;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 3px solid #A9D2D8;
              padding-bottom: 20px;
            }
            .title {
              font-size: 28px;
              color: #D0AC8A;
              margin-bottom: 10px;
              font-weight: bold;
            }
            .subtitle {
              font-size: 18px;
              color: #5A9BA5;
              font-weight: 500;
            }
            .stats {
              display: flex;
              justify-content: space-around;
              margin: 25px 0;
              background-color: #F8FAF9;
              padding: 20px;
              border-radius: 10px;
              border: 1px solid #A9D2D8;
            }
            .stat-item {
              text-align: center;
            }
            .stat-number {
              font-size: 24px;
              font-weight: bold;
              color: #5A9BA5;
              margin-bottom: 5px;
            }
            .stat-label {
              font-size: 14px;
              color: #D0AC8A;
              font-weight: 500;
            }
            .guest-list {
              margin-top: 25px;
            }
            .guest-list-title {
              color: #D0AC8A;
              font-size: 20px;
              font-weight: bold;
              margin-bottom: 20px;
              text-align: center;
              background-color: #ECF2F2;
              padding: 15px;
              border-radius: 8px;
              border: 1px solid #A9D2D8;
            }
            .guest-item {
              background-color: #F8FAF9;
              border: 1px solid #A9D2D8;
              border-radius: 8px;
              padding: 15px;
              margin-bottom: 12px;
              page-break-inside: avoid;
            }
            .guest-name {
              font-size: 16px;
              font-weight: bold;
              color: #D0AC8A;
              margin-bottom: 8px;
            }
            .guest-details {
              font-size: 14px;
              color: #5A9BA5;
            }
            .people-list {
              margin-bottom: 10px;
              padding: 10px;
              background-color: #ECF2F2;
              border-radius: 6px;
              border: 1px solid #A9D2D8;
            }
            .person-detail {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 5px;
              padding: 3px 0;
            }
            .person-detail:last-child {
              margin-bottom: 0;
            }
            .person-name {
              font-weight: 500;
              color: #D0AC8A;
              font-size: 14px;
            }
            .person-age {
              font-size: 12px;
              color: #5A9BA5;
              font-style: italic;
              background-color: #F8FAF9;
              padding: 2px 8px;
              border-radius: 10px;
              border: 1px solid #A9D2D8;
            }
            .summary-badges {
              margin: 10px 0;
            }
            .badge {
              display: inline-block;
              background-color: #5A9BA5;
              color: white;
              padding: 4px 10px;
              border-radius: 15px;
              font-size: 12px;
              margin-right: 8px;
              margin-bottom: 5px;
              font-weight: 500;
            }
            .badge-children {
              background-color: #94a3b8;
            }
            .guest-date {
              color: #5A9BA5;
              font-size: 12px;
              font-style: italic;
              margin-top: 5px;
            }
            .footer {
              margin-top: 40px;
              text-align: center;
              font-size: 12px;
              color: #5A9BA5;
              border-top: 2px solid #A9D2D8;
              padding-top: 20px;
            }
            .footer p {
              margin: 5px 0;
            }
            @media print {
              body { 
                margin: 0; 
                padding: 15px;
              }
              .guest-item {
                page-break-inside: avoid;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">🎉 Lista de Convidados - Aniversário do Henry</div>
            <div class="subtitle">Festa de 1 ano - 31 de Outubro de 2024 - 19:00h</div>
          </div>
          
          <div class="stats">
            <div class="stat-item">
              <div class="stat-number">${totalGuests}</div>
              <div class="stat-label">Pessoas 6+ anos</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">${totalChildrenUnder6}</div>
              <div class="stat-label">Crianças &lt;6 anos</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">${totalPeople}</div>
              <div class="stat-label">Total de Pessoas</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">${totalConfirmations}</div>
              <div class="stat-label">Famílias</div>
            </div>
          </div>
          
          <div class="guest-list">
            <div class="guest-list-title">
              Lista de Convidados Confirmados (${attendingGuests.length})
              ${sortAlphabetically ? ' - Ordem Alfabética' : ''}
            </div>
      `
      
      // Adicionar cada convidado
      attendingGuests.forEach((guest, index) => {
        const additionalNames = guest.additional_names ? guest.additional_names.split(', ') : []
        const peopleOver6 = guest.people_over_6 || 1
        const childrenUnder6 = guest.number_of_people - peopleOver6
        
        // Criar lista detalhada de pessoas
        let detailedPeopleList = ''
        
        // Pessoa principal (sempre 6+ anos)
        detailedPeopleList += `
          <div class="person-detail">
            <span class="person-name">👤 ${guest.name}</span>
          </div>
        `
        
        // Acompanhantes
        if (additionalNames.length > 0) {
          additionalNames.forEach((name, nameIndex) => {
            if (name.trim()) {
              // Determinar se é criança ou adulto baseado na posição
              // As primeiras pessoas são adultas (6+ anos), as últimas são crianças (<6 anos)
              const isChild = nameIndex >= (peopleOver6 - 1)
              const ageIcon = isChild ? '👶' : '👤'
              
              detailedPeopleList += `
                <div class="person-detail">
                  <span class="person-name">${ageIcon} ${name.trim()}</span>
                </div>
              `
            }
          })
        }
        
        htmlContent += `
          <div class="guest-item">
            <div class="guest-name">${index + 1}. ${sortAlphabetically ? guest.name : `Família de ${guest.name}`}</div>
            <div class="guest-details">
              <div class="people-list">
                ${detailedPeopleList}
              </div>
              <div class="summary-badges">
                <span class="badge">${peopleOver6} pessoa${peopleOver6 > 1 ? 's' : ''} 6+ anos</span>
                ${childrenUnder6 > 0 ? `<span class="badge badge-children">${childrenUnder6} criança${childrenUnder6 > 1 ? 's' : ''} &lt;6 anos</span>` : ''}
              </div>
              <div class="guest-date">
                Confirmado em: ${new Date(guest.created_at).toLocaleDateString('pt-BR')}
              </div>
            </div>
          </div>
        `
      })
      
      htmlContent += `
          </div>
          
          <div class="footer">
            <p><strong>Lista gerada em:</strong> ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</p>
            <p><strong>Local:</strong> Karol Buffet - Rua Noruega 155, Maraponga, Fortaleza - CE</p>
            <p><strong>Contato:</strong> Jesa - (85) 9 3192-6460</p>
          </div>
        </body>
        </html>
      `
      
      // Abrir em nova janela para impressão
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(htmlContent)
        printWindow.document.close()
        
        // Aguardar o conteúdo carregar e então imprimir
        printWindow.onload = () => {
          setTimeout(() => {
            printWindow.print()
            printWindow.close()
          }, 500)
        }
        
        toast({
          title: "Abrindo para impressão!",
          description: `A lista ${sortAlphabetically ? 'ordenada alfabeticamente ' : ''}será aberta em uma nova janela para impressão/PDF.`,
        })
      } else {
        throw new Error("Não foi possível abrir a janela de impressão")
      }
      
    } catch (error) {
      console.error("Erro ao gerar PDF:", error)
      toast({
        title: "Erro ao gerar PDF",
        description: "Não foi possível abrir a lista para impressão.",
        variant: "destructive",
      })
    }
  }

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
    <div className="admin-page-container">
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
            <div className="flex justify-between items-center">
              <CardTitle style={{ color: "#D0AC8A" }}>
                Confirmações ({confirmations.length})
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  onClick={() => downloadGuestListPDF(false)}
                  style={{ backgroundColor: "#5A9BA5", color: "white" }}
                  className="flex items-center gap-2"
                >
                  📄 PDF Normal
                </Button>
                <Button
                  onClick={() => downloadGuestListPDF(true)}
                  style={{ backgroundColor: "#D0AC8A", color: "white" }}
                  className="flex items-center gap-2"
                >
                  🔤 PDF Alfabético
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {confirmations.length === 0 ? (
              <p className="text-center py-8" style={{ color: "#5A9BA5" }}>
                Nenhuma confirmação ainda
              </p>
            ) : (
              <div className="space-y-4 confirmations-list">
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

        {/* Gerenciamento de Presentes */}
        <Card style={{ backgroundColor: "#ECF2F2", borderColor: "#A9D2D8" }}>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle style={{ color: "#D0AC8A" }}>
                Lista de Presentes ({gifts.filter(g => g.is_active).length} ativos)
              </CardTitle>
              <Button
                onClick={() => setShowGiftsModal(true)}
                style={{ backgroundColor: "#FFCAAB", color: "#D0AC8A" }}
              >
                Gerenciar Presentes
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {gifts.filter(g => g.is_active).map((gift) => (
                <div key={gift.id} className="flex items-center justify-between p-2 rounded border" style={{ borderColor: "#A9D2D8" }}>
                  <div>
                    <p className="font-medium" style={{ color: "#D0AC8A" }}>{gift.name}</p>
                    {gift.description && (
                      <p className="text-sm" style={{ color: "#5A9BA5" }}>{gift.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingGift(gift)}
                      style={{ borderColor: "#A9D2D8", color: "#D0AC8A" }}
                    >
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteGift(gift.id)}
                      style={{ borderColor: "#ef4444", color: "#ef4444" }}
                    >
                      Remover
                    </Button>
                  </div>
                </div>
              ))}
            </div>
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

      {/* Modal para gerenciar presentes */}
      <Dialog open={showGiftsModal} onOpenChange={setShowGiftsModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle style={{ color: "#D0AC8A" }}>Gerenciar Lista de Presentes</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Adicionar novo presente */}
            <div className="p-4 border rounded" style={{ borderColor: "#A9D2D8" }}>
              <h3 className="font-medium mb-3" style={{ color: "#D0AC8A" }}>Adicionar Novo Presente</h3>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="giftName" style={{ color: "#D0AC8A" }}>Nome do Presente *</Label>
                  <Input
                    id="giftName"
                    value={newGiftName}
                    onChange={(e) => setNewGiftName(e.target.value)}
                    placeholder="Ex: Roupinhas (tamanho 1-2 anos)"
                    style={{ borderColor: "#A9D2D8" }}
                  />
                </div>
                <div>
                  <Label htmlFor="giftDescription" style={{ color: "#D0AC8A" }}>Descrição (opcional)</Label>
                  <Input
                    id="giftDescription"
                    value={newGiftDescription}
                    onChange={(e) => setNewGiftDescription(e.target.value)}
                    placeholder="Ex: Roupas para bebê de 1 a 2 anos"
                    style={{ borderColor: "#A9D2D8" }}
                  />
                </div>
                <Button
                  onClick={handleAddGift}
                  disabled={!newGiftName.trim()}
                  style={{ backgroundColor: "#FFCAAB", color: "#D0AC8A" }}
                >
                  Adicionar Presente
                </Button>
              </div>
            </div>

            {/* Lista de presentes */}
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {gifts.map((gift) => (
                <div key={gift.id} className="flex items-center justify-between p-3 border rounded" style={{ borderColor: "#A9D2D8" }}>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={gift.is_active}
                        onCheckedChange={(checked) => handleUpdateGift({ ...gift, is_active: checked })}
                      />
                      <div>
                        <p className="font-medium" style={{ color: "#D0AC8A" }}>{gift.name}</p>
                        {gift.description && (
                          <p className="text-sm" style={{ color: "#5A9BA5" }}>{gift.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingGift(gift)}
                      style={{ borderColor: "#A9D2D8", color: "#D0AC8A" }}
                    >
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteGift(gift.id)}
                      style={{ borderColor: "#ef4444", color: "#ef4444" }}
                    >
                      Remover
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal para editar presente */}
      <Dialog open={!!editingGift} onOpenChange={() => setEditingGift(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle style={{ color: "#D0AC8A" }}>Editar Presente</DialogTitle>
          </DialogHeader>
          
          {editingGift && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="editGiftName" style={{ color: "#D0AC8A" }}>Nome do Presente *</Label>
                <Input
                  id="editGiftName"
                  value={editingGift.name}
                  onChange={(e) => setEditingGift({ ...editingGift, name: e.target.value })}
                  style={{ borderColor: "#A9D2D8" }}
                />
              </div>
              <div>
                <Label htmlFor="editGiftDescription" style={{ color: "#D0AC8A" }}>Descrição</Label>
                <Input
                  id="editGiftDescription"
                  value={editingGift.description || ""}
                  onChange={(e) => setEditingGift({ ...editingGift, description: e.target.value })}
                  style={{ borderColor: "#A9D2D8" }}
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={editingGift.is_active}
                  onCheckedChange={(checked) => setEditingGift({ ...editingGift, is_active: checked })}
                />
                <Label style={{ color: "#D0AC8A" }}>Ativo</Label>
              </div>
              
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setEditingGift(null)}
                  style={{ borderColor: "#A9D2D8", color: "#D0AC8A" }}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={() => {
                    handleUpdateGift(editingGift)
                    setEditingGift(null)
                  }}
                  style={{ backgroundColor: "#FFCAAB", color: "#D0AC8A" }}
                >
                  Salvar
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* CSS para garantir scroll */}
      <style jsx global>{`
        /* Reset completo para página de admin */
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          overflow: auto !important;
          height: auto !important;
          min-height: 100vh !important;
          position: static !important;
          top: auto !important;
          left: auto !important;
        }
        
        /* Garantir que o container principal tenha scroll */
        .admin-page-container {
          min-height: 100vh !important;
          height: auto !important;
          overflow: auto !important;
          padding: 1.5rem !important;
          background-color: #F8FAF9 !important;
        }
        
        /* Lista de confirmações com scroll */
        .confirmations-list {
          max-height: 600px;
          overflow-y: auto;
          padding-right: 0.5rem;
        }
        
        /* Estilizar scrollbar */
        .confirmations-list::-webkit-scrollbar {
          width: 8px;
        }
        
        .confirmations-list::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        
        .confirmations-list::-webkit-scrollbar-thumb {
          background: #A9D2D8;
          border-radius: 4px;
        }
        
        .confirmations-list::-webkit-scrollbar-thumb:hover {
          background: #5A9BA5;
        }
      `}</style>
    </div>
  )
}
