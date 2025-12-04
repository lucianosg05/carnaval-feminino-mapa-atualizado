export function extractContact(block: any) {
  if (!block) return { email: null, phone: null }
  // Prefer explicit responsavelEmail
  const emailCandidates: string[] = []
  if (block.responsavelEmail) emailCandidates.push(block.responsavelEmail)
  if (block.contato && typeof block.contato === 'string') {
    // split by common separators
    const parts = block.contato.split('|').map((p: string) => p.trim())
    parts.forEach((p: string) => {
      if (p.includes('@')) emailCandidates.push(p)
    })
  }

  const email = emailCandidates.length ? emailCandidates[0] : null

  // Phone extraction: look for sequences of digits, ignore emails
  let phone: string | null = null
  if (block.contato && typeof block.contato === 'string') {
    // remove emails
    const withoutEmails = block.contato.replace(/\S+@\S+\.\S+/g, '')
    const matches = withoutEmails.match(/\+?\d[\d\s\-().]{6,}\d/g)
    if (matches && matches.length) {
      // pick first, normalize to digits only
      const digits = matches[0].replace(/\D/g, '')
      // if no country code, assume Brazil '55' when length is 10 or 11
      if (digits.length === 10 || digits.length === 11) phone = `55${digits}`
      else phone = digits
    }
  }

  return { email, phone }
}
