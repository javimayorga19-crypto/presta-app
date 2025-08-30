export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      backups: {
        Row: {
          archivo_url: string
          created_at: string
          created_by: string
          descripcion: string | null
          id: string
          nombre: string
          tamano: number
          tipo: string
        }
        Insert: {
          archivo_url: string
          created_at?: string
          created_by?: string
          descripcion?: string | null
          id?: string
          nombre: string
          tamano?: number
          tipo?: string
        }
        Update: {
          archivo_url?: string
          created_at?: string
          created_by?: string
          descripcion?: string | null
          id?: string
          nombre?: string
          tamano?: number
          tipo?: string
        }
        Relationships: []
      }
      clients: {
        Row: {
          cedula: string | null
          clasificacion: string
          cobrador: string
          codigo: string
          created_at: string
          direccion: string | null
          estado: string
          fecha_ultimo_pago: string | null
          id: string
          nombre: string
          orden_ruta: number
          ruta: string
          saldo_pendiente: number
          telefono: string | null
          updated_at: string
        }
        Insert: {
          cedula?: string | null
          clasificacion?: string
          cobrador?: string
          codigo: string
          created_at?: string
          direccion?: string | null
          estado?: string
          fecha_ultimo_pago?: string | null
          id?: string
          nombre: string
          orden_ruta?: number
          ruta?: string
          saldo_pendiente?: number
          telefono?: string | null
          updated_at?: string
        }
        Update: {
          cedula?: string | null
          clasificacion?: string
          cobrador?: string
          codigo?: string
          created_at?: string
          direccion?: string | null
          estado?: string
          fecha_ultimo_pago?: string | null
          id?: string
          nombre?: string
          orden_ruta?: number
          ruta?: string
          saldo_pendiente?: number
          telefono?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      expenses: {
        Row: {
          categoria: string
          cobrador: string
          comprobante_url: string | null
          concepto: string
          created_at: string
          descripcion: string | null
          fecha: string
          id: string
          monto: number
          ruta: string
          updated_at: string
        }
        Insert: {
          categoria?: string
          cobrador?: string
          comprobante_url?: string | null
          concepto: string
          created_at?: string
          descripcion?: string | null
          fecha?: string
          id?: string
          monto: number
          ruta?: string
          updated_at?: string
        }
        Update: {
          categoria?: string
          cobrador?: string
          comprobante_url?: string | null
          concepto?: string
          created_at?: string
          descripcion?: string | null
          fecha?: string
          id?: string
          monto?: number
          ruta?: string
          updated_at?: string
        }
        Relationships: []
      }
      loans: {
        Row: {
          client_id: string
          cobrador: string
          codigo: string
          created_at: string
          estado: string
          fecha_desembolso: string
          fecha_proximo_pago: string
          fecha_vencimiento: string
          frecuencia: string
          id: string
          monto_original: number
          plazo_restante: number
          plazo_total: number
          ruta: string
          saldo_pendiente: number
          tasa_interes: number
          updated_at: string
          valor_cuota: number
        }
        Insert: {
          client_id: string
          cobrador?: string
          codigo: string
          created_at?: string
          estado?: string
          fecha_desembolso: string
          fecha_proximo_pago: string
          fecha_vencimiento: string
          frecuencia?: string
          id?: string
          monto_original: number
          plazo_restante: number
          plazo_total: number
          ruta?: string
          saldo_pendiente: number
          tasa_interes?: number
          updated_at?: string
          valor_cuota: number
        }
        Update: {
          client_id?: string
          cobrador?: string
          codigo?: string
          created_at?: string
          estado?: string
          fecha_desembolso?: string
          fecha_proximo_pago?: string
          fecha_vencimiento?: string
          frecuencia?: string
          id?: string
          monto_original?: number
          plazo_restante?: number
          plazo_total?: number
          ruta?: string
          saldo_pendiente?: number
          tasa_interes?: number
          updated_at?: string
          valor_cuota?: number
        }
        Relationships: [
          {
            foreignKeyName: "loans_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          client_id: string
          cobrador: string
          created_at: string
          fecha_pago: string
          id: string
          loan_id: string
          metodo_pago: string
          monto: number
          numero_recibo: string
          observaciones: string | null
          tipo: string
          updated_at: string
        }
        Insert: {
          client_id: string
          cobrador?: string
          created_at?: string
          fecha_pago: string
          id?: string
          loan_id: string
          metodo_pago?: string
          monto: number
          numero_recibo: string
          observaciones?: string | null
          tipo?: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          cobrador?: string
          created_at?: string
          fecha_pago?: string
          id?: string
          loan_id?: string
          metodo_pago?: string
          monto?: number
          numero_recibo?: string
          observaciones?: string | null
          tipo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_loan_id_fkey"
            columns: ["loan_id"]
            isOneToOne: false
            referencedRelation: "loans"
            referencedColumns: ["id"]
          },
        ]
      }
      routes: {
        Row: {
          activa: boolean
          cobrador: string
          created_at: string
          descripcion: string | null
          id: string
          nombre: string
          updated_at: string
        }
        Insert: {
          activa?: boolean
          cobrador?: string
          created_at?: string
          descripcion?: string | null
          id?: string
          nombre: string
          updated_at?: string
        }
        Update: {
          activa?: boolean
          cobrador?: string
          created_at?: string
          descripcion?: string | null
          id?: string
          nombre?: string
          updated_at?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          activo: boolean
          created_at: string
          email: string
          id: string
          nombre: string
          rol: string
          rutas_asignadas: string[] | null
          updated_at: string
        }
        Insert: {
          activo?: boolean
          created_at?: string
          email: string
          id?: string
          nombre: string
          rol?: string
          rutas_asignadas?: string[] | null
          updated_at?: string
        }
        Update: {
          activo?: boolean
          created_at?: string
          email?: string
          id?: string
          nombre?: string
          rol?: string
          rutas_asignadas?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
