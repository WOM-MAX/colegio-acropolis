import React from 'react';
import { SocialIcon } from '@/components/layout/Header';
import { db } from '@/lib/db';
import { configuracionSitio } from '@/lib/db/schema';

type RedSocial = {
  plataforma: string;
  url: string;
};

type TelefonoItem = {
  etiqueta: string;
  numero: string;
  tipo?: string;
};

type EmailItem = {
  etiqueta: string;
  email: string;
};

type ContactoConfig = {
  titulo?: string;
  direccion?: string;
  // Legacy single fields (backward compat)
  telefono?: string;
  email?: string;
  // New multi fields
  telefonos?: TelefonoItem[];
  emails?: EmailItem[];
  redesSociales?: RedSocial[];
  mapaEmbedUrl?: string;
  colorPrincipal?: string;
};

const cleanUrl = (url: string) => {
  let cleaned = url.trim().replace(/\s/g, '');
  if (cleaned && !cleaned.startsWith('http://') && !cleaned.startsWith('https://')) {
    cleaned = `https://${cleaned}`;
  }
  return cleaned;
};

export default async function ContactoInfoBlock({ configuracion }: { configuracion: any }) {
  const config = (configuracion || {}) as ContactoConfig;
  const mainColor = config.colorPrincipal || '#243A73';
  
  // Fetch Global Configuration to ensure consistency
  const configRows = await db.select().from(configuracionSitio).limit(1);
  const globalConfig = configRows[0];

  // Logic: Prefer Block Config. If missing, fallback to Global Config.
  let telefonos: TelefonoItem[] = [];
  if (config.telefonos?.length) telefonos = config.telefonos;
  else if (config.telefono) telefonos = [{ etiqueta: '', numero: config.telefono }];
  else if (globalConfig?.telefonos) telefonos = globalConfig.telefonos as TelefonoItem[];

  let emailsList: EmailItem[] = [];
  if (config.emails?.length) emailsList = config.emails;
  else if (config.email) emailsList = [{ etiqueta: '', email: config.email }];
  else if (globalConfig?.emails) emailsList = globalConfig.emails as EmailItem[];

  let redes: RedSocial[] = [];
  if (config.redesSociales?.length) redes = config.redesSociales;
  else if (globalConfig?.redesSociales) redes = globalConfig.redesSociales as RedSocial[];

  const direccionFinal = config.direccion || globalConfig?.direccion || '';
  let mapUrlBase = config.mapaEmbedUrl || globalConfig?.mapaEmbedUrl || '';

  // Extract URL if the user pastes the whole iframe tag instead of just the src
  let finalMapSrc = mapUrlBase;
  if (finalMapSrc.includes('<iframe') && finalMapSrc.includes('src="')) {
    const match = finalMapSrc.match(/src="([^"]+)"/);
    if (match && match[1]) {
      finalMapSrc = match[1];
    }
  }

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-50 rounded-3xl overflow-hidden shadow-sm border border-gray-200 grid grid-cols-1 md:grid-cols-2">
          
          <div className="p-6 sm:p-10 md:p-14 flex flex-col justify-center text-white" style={{ backgroundColor: mainColor }}>
            {config.titulo && (
              <div className="rich-title font-bold mb-8 [&_h2]:text-amarillo-acropolis [&_h3]:text-amarillo-acropolis [&_h4]:text-amarillo-acropolis [&_p]:text-amarillo-acropolis"
                  dangerouslySetInnerHTML={{ __html: config.titulo }} />
            )}
            
            <div className="space-y-6">
              {direccionFinal && (
                <div className="flex items-start">
                  <svg className="w-6 h-6 mr-4 mt-1 flex-shrink-0 text-amarillo-acropolis" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Dirección</h4>
                    <p className="text-gray-200 leading-relaxed">{direccionFinal}</p>
                  </div>
                </div>
              )}

              {/* Teléfonos (múltiples) */}
              {telefonos.length > 0 && (
                <div className="flex items-start">
                  <svg className="w-6 h-6 mr-4 mt-1 flex-shrink-0 text-amarillo-acropolis" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Teléfonos</h4>
                    <div className="space-y-1">
                      {telefonos.map((tel, i) => (
                        <p key={i} className="text-gray-200 leading-relaxed">
                          {tel.numero}
                          {tel.etiqueta && <span className="ml-2 text-sm text-gray-300">({tel.etiqueta})</span>}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Emails (múltiples) */}
              {emailsList.length > 0 && (
                <div className="flex items-start">
                  <svg className="w-6 h-6 mr-4 mt-1 flex-shrink-0 text-amarillo-acropolis" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Correo Electrónico</h4>
                    <div className="space-y-1">
                      {emailsList.map((em, i) => (
                        <a key={i} href={`mailto:${em.email}`} className="block text-gray-200 hover:text-amarillo-acropolis transition-colors leading-relaxed">
                          {em.email}
                          {em.etiqueta && <span className="ml-2 text-sm text-gray-300">({em.etiqueta})</span>}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Redes Sociales (propias de la página) */}
              {redes.length > 0 && (
                <div className="flex items-start">
                  <svg className="w-6 h-6 mr-4 mt-1 flex-shrink-0 text-amarillo-acropolis" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Redes Sociales</h4>
                    <div className="flex gap-3">
                      {redes.map((red, i) => (
                        <a
                          key={`${red.plataforma}-${i}`}
                          href={cleanUrl(red.url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-white hover:bg-amarillo-acropolis hover:text-negro transition-all"
                          aria-label={red.plataforma}
                        >
                          <SocialIcon platform={red.plataforma} size={20} />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
          </div>
          
          <div className="h-[400px] md:h-auto bg-gray-200">
            {finalMapSrc ? (
              <iframe 
                src={finalMapSrc} 
                className="w-full h-full border-0" 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Maps"
              ></iframe>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500 bg-gray-200">
                <p>No se especificó la URL del mapa</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
