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
    <div className="flex flex-col items-center gap-2 p-3 rounded-lg bg-white/5 border border-white/10 hover:border-gold/40 transition-colors duration-200">
      <div className="w-10 h-10 flex items-center justify-center">
        <Image
          src={`/icons/tools/${meta.file}`}
          alt={meta.label}
          width={40}
          height={40}
          className="object-contain w-full h-full"
        />
      </div>
      <span className="text-[10px] text-center text-white/60 leading-tight font-medium tracking-wide">
        {meta.label}
      </span>
    </div>
  );
}
