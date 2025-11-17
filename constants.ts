export const INTERESTS = [
  'Praias', 'Gastronomia', 'Cultura', 'Natureza', 
  'Fotografia', 'Turismo', 'Esportes', 'Lazer'
] as const;

export const TRIP_DURATIONS = [
  { value: '1', label: '1 dia' },
  { value: '2', label: '2 dias' },
  { value: '3', label: '3 dias' },
  { value: '4', label: '4 dias' },
  { value: '5', label: '5 dias' },
  { value: '6', label: '6 dias' },
  { value: '7', label: '7 dias ou mais' },
] as const;

export const LODGING_NEIGHBORHOODS = [
  'Copacabana', 'Ipanema', 'Leblon', 'Lapa', 'Centro',
  'Flamengo', 'Botafogo', 'Barra da Tijuca', 'Outro'
] as const;

export const LODGING_TYPES = [
  'Hotel', 'Airbnb', 'Pousada', 'Hostel', 'Casa de Amigos'
] as const;

export const GROUP_COMPOSITION = [
  'Sozinho', 'Casal', 'Família', 'Amigos', 'Grupo'
] as const;

export const ACCESSIBILITY_OPTIONS = [
  'Não', 'Mobilidade reduzida', 'Deficiência visual', 'Outra'
] as const;

export const TRAVEL_PACING = [
    { id: 'Relaxado', label: 'Relaxado', description: 'poucos compromissos' },
    { id: 'Moderado', label: 'Moderado', description: 'equilibrado' },
    { id: 'Intenso', label: 'Intenso', description: 'máximo de atividades' },
] as const;

export const DAILY_BUDGETS = [
    { id: 'R$ 50-100', label: 'R$ 50-100', description: 'econômico' },
    { id: 'R$ 100-200', label: 'R$ 100-200', description: 'moderado' },
    { id: 'R$ 200-300', label: 'R$ 200-300', description: 'confortável' },
    { id: 'R$ 300+', label: 'R$ 300+', description: 'premium' },
] as const;

export const TRANSPORT_OPTIONS = [
  'Metrô', 'Ônibus', 'Táxi', 'Uber', 'Carro alugado', 'A pé'
] as const;

export const MEAL_OPTIONS = [
  'Café da manhã', 'Almoço', 'Café da tarde', 'Jantar'
] as const;
