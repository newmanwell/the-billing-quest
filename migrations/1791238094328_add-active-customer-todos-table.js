/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createTable('active_customer_todos', {
    id: 'id',
    active_customer_id: {
      type: 'integer',
      notNull: true,
      references: 'active_customers',
      onDelete: 'CASCADE',
    },
    text: {
      type: 'varchar(255)',
      notNull: true,
    },
    completed: {
      type: 'boolean',
      notNull: true,
      default: false,
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable('active_customer_todos');
};
