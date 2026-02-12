import React from 'react'
import {
  Home24Regular, Home24Filled,
  Branch24Regular, Branch24Filled,
  Add24Regular, Add24Filled,
  Options24Regular, Options24Filled,
  PlugConnected24Regular, PlugConnected24Filled,
  Wand24Regular, Wand24Filled,
  Document24Regular, Document24Filled,
  Target24Regular, Target24Filled,
  TaskListSquareLtr24Regular, TaskListSquareLtr24Filled,
  TranslateAuto24Regular, TranslateAuto24Filled,
  Shield24Regular, Shield24Filled,
  SquareHintSparkles24Regular, SquareHintSparkles24Filled,
  Diversity24Regular, Diversity24Filled,
  TargetSparkle24Regular, TargetSparkle24Filled,
  BookmarkAdd24Regular, BookmarkAdd24Filled,
} from '@fluentui/react-icons'

const PAIRS = {
  Home24: { Regular: Home24Regular, Filled: Home24Filled },
  Branch24: { Regular: Branch24Regular, Filled: Branch24Filled },
  Add24: { Regular: Add24Regular, Filled: Add24Filled },
  Options24: { Regular: Options24Regular, Filled: Options24Filled },
  PlugConnected24: { Regular: PlugConnected24Regular, Filled: PlugConnected24Filled },
  Wand24: { Regular: Wand24Regular, Filled: Wand24Filled },
  Document24: { Regular: Document24Regular, Filled: Document24Filled },
  Target24: { Regular: Target24Regular, Filled: Target24Filled },
  TaskListSquareLtr24: { Regular: TaskListSquareLtr24Regular, Filled: TaskListSquareLtr24Filled },
  TranslateAuto24: { Regular: TranslateAuto24Regular, Filled: TranslateAuto24Filled },
  Shield24: { Regular: Shield24Regular, Filled: Shield24Filled },
  SquareHintSparkles24: { Regular: SquareHintSparkles24Regular, Filled: SquareHintSparkles24Filled },
  Diversity24: { Regular: Diversity24Regular, Filled: Diversity24Filled },
  TargetSparkle24: { Regular: TargetSparkle24Regular, Filled: TargetSparkle24Filled },
  BookmarkAdd24: { Regular: BookmarkAdd24Regular, Filled: BookmarkAdd24Filled },
}

export default function SidebarIcon({ name, active }){
  const safe = (name || 'Document24Regular')
  const base = safe.replace('Regular', '').replace('Filled', '')
  const pair = PAIRS[base] || PAIRS.Document24
  const Comp = active ? pair.Filled : pair.Regular
  return <Comp />
}
