import {
  $find,
  $has,
  $text,
} from './helpers';

function identifier(value) {
  if (typeof value === 'string') return value.replace(/^#/, '');
  return null;
}

async function scan(loc, doc) {
  if (loc.host !== 'ora.pm') return [];

  if ($has('#task-modal.single-task-modal', doc)) {
    const task = $find('#task-modal.single-task-modal', doc);
    const id = identifier($text('.task-id', task));
    const title = $text('#task-title', task);
    const type = $text('[data-ng-if="features[\'task_types\']"]', task) || 'feature';
    return [{ id, title, type }];
  }

  return [];
}

export default scan;
