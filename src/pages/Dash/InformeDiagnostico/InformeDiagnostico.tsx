import { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { AlertCircle, CheckCircle2, Upload } from 'lucide-react'

export default function InformeDiagnostico() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [equipoIrreparable, setEquipoIrreparable] = useState(false)
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    const form = event.currentTarget
    const formData = new FormData(form)

    const informeData = {
      id_ordenTrabajo: parseInt(formData.get('id_ordenTrabajo') as string),
      numeroSerie: formData.get('numeroSerie'),
      estadoActual: formData.get('estadoActual'),
      problemasEncontrados: formData.get('problemasEncontrados'),
      diagnosticoTecnico: formData.get('diagnosticoTecnico'),
      recomendaciones: formData.get('recomendaciones'),
      factibilidadReparacion: formData.get('factibilidadReparacion'),
      equipoirreparable: equipoIrreparable,
      observacionesAdicionales: formData.get('observacionesAdicionales'),
      fecha: new Date().toISOString()
    }

    const dataToSend = new FormData()
    dataToSend.append('informe', JSON.stringify(informeData))
    
    const fileInput = fileInputRef.current
    if (fileInput && fileInput.files && fileInput.files.length > 0) {
      dataToSend.append('file', fileInput.files[0])
    }

    try {
      const response = await fetch('http://localhost:8080/api/informediagnostico', {
        method: 'POST',
        body: dataToSend,
      })

      if (response.ok) {
        toast({
          title: "Informe enviado",
          description: "El informe de diagnóstico ha sido guardado y enviado correctamente.",
          duration: 5000,
        })
        form.reset()
        setEquipoIrreparable(false)
      } else {
        throw new Error('Error al enviar el informe')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al enviar el informe. Por favor, intente nuevamente.",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Elaborar Informe de Diagnóstico</CardTitle>
        <CardDescription>Complete los campos para generar el informe de diagnóstico del equipo.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="id_ordenTrabajo">ID de Orden de Trabajo</Label>
              <Input id="id_ordenTrabajo" name="id_ordenTrabajo" type="number" placeholder="Ej: 2" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="numeroSerie">Número de Serie</Label>
              <Input id="numeroSerie" name="numeroSerie" placeholder="Ej: ABC123456" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="estadoActual">Estado Actual</Label>
            <Select name="estadoActual" required>
              <SelectTrigger id="estadoActual">
                <SelectValue placeholder="Seleccione el estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="En proceso">En proceso</SelectItem>
                <SelectItem value="Reparado">Reparado</SelectItem>
                <SelectItem value="No reparable">No reparable</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="problemasEncontrados">Problemas Encontrados</Label>
            <Textarea id="problemasEncontrados" name="problemasEncontrados" placeholder="Describa los problemas encontrados en el equipo" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="diagnosticoTecnico">Diagnóstico Técnico</Label>
            <Textarea id="diagnosticoTecnico" name="diagnosticoTecnico" placeholder="Detalle el diagnóstico técnico del equipo" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="recomendaciones">Recomendaciones</Label>
            <Textarea id="recomendaciones" name="recomendaciones" placeholder="Indique las recomendaciones para la reparación o mantenimiento" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="factibilidadReparacion">Factibilidad de Reparación</Label>
            <Select name="factibilidadReparacion" required>
              <SelectTrigger id="factibilidadReparacion">
                <SelectValue placeholder="Seleccione la factibilidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Alta">Alta</SelectItem>
                <SelectItem value="Media">Media</SelectItem>
                <SelectItem value="Baja">Baja</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="equipoirreparable"
              checked={equipoIrreparable}
              onCheckedChange={setEquipoIrreparable}
            />
            <Label htmlFor="equipoirreparable">Equipo Irreparable</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacionesAdicionales">Observaciones Adicionales</Label>
            <Textarea id="observacionesAdicionales" name="observacionesAdicionales" placeholder="Agregue cualquier observación adicional relevante" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">Adjuntar Informe PDF</Label>
            <Input id="file" name="file" type="file" accept=".pdf" ref={fileInputRef} required />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <AlertCircle className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Guardar y Enviar
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}