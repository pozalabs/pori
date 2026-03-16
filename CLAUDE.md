## Linear

- team: IP
- area: pori

## Documentation style

- Start JSDoc descriptions with a verb, no subject (e.g., `Draws a waveform.` not `This is a hook that draws a waveform.`)
- Use "audio" as the domain term (not "song", "track", or "music")
- Parameter descriptions: use noun phrases or `Whether ...` for booleans
- Default value format: `(default: \`value\`)`
- Type JSDoc format: `Props for ...` / `Return type of ...` (no leading "The")
- End sentences with a period; omit periods for phrases
- Do not repeat shared descriptions on every sub-component; describe once in the parent
- Add `@example` with 3-5 line minimal working code (including imports) to public hooks and components; skip utilities and sub-components
- Each sub-component file must have its own one-line JSDoc describing its unique behavior
