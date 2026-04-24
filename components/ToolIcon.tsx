import Image from 'next/image';

const TOOL_META: Record<string, { label: string; file: string }> = {
  'unreal-engine':     { label: 'Unreal Engine',    file: 'unreal-engine.png' },
  'unity':             { label: 'Unity',             file: 'unity.png' },
  'blender':           { label: 'Blender',           file: 'blender.png' },
  'zbrush':            { label: 'ZBrush',            file: 'zbrush.png' },
  'substance-painter': { label: 'Substance Painter', file: 'substance-painter.png' },
  'marmoset-toolbag':  { label: 'Marmoset Toolbag',  file: 'marmoset-toolbag.png' },
  'photoshop':         { label: 'Photoshop',         file: 'photoshop.png' },
  'illustrator':       { label: 'Illustrator',       file: 'illustrator.png' },
  'premiere-pro':      { label: 'Premiere Pro',      file: 'premiere-pro.png' },
  'revit':             { label: 'Revit',             file: 'revit.png' },
  'autocad':           { label: 'AutoCAD',           file: 'autocad.png' },
  'protastructure':    { label: 'ProtaStructure',    file: 'protastructure.png' },
  'abaqus':            { label: 'ABAQUS',            file: 'abaqus.png' },
  'etabs':             { label: 'ETABS',             file: 'etabs.png' },
  'tekla':             { label: 'Tekla Structures',  file: 'tekla.png' },
  'midas':             { label: 'Midas',             file: 'midas.png' },
  'lumion':            { label: 'Lumion',            file: 'lumion.png' },
  'ms-project':        { label: 'MS Project',        file: 'ms-project.png' },
};

export default function ToolIcon({ tool }: { tool: string }) {
  const meta = TOOL_META[tool];
  if (!meta) return null;

  return (
    <div
      title={meta.label}
      className="relative group/tip w-10 h-10 p-2 rounded-lg bg-white/5 border border-white/10 hover:border-gold/40 transition-colors duration-200 flex items-center justify-center cursor-default"
    >
      <Image
        src={`/icons/tools/${meta.file}`}
        alt={meta.label}
        width={24}
        height={24}
        className="object-contain w-full h-full"
      />
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded bg-[#1a1a1a] border border-white/10 text-[10px] text-white/80 whitespace-nowrap opacity-0 group-hover/tip:opacity-100 transition-opacity duration-150 pointer-events-none z-10">
        {meta.label}
      </div>
    </div>
  );
}
