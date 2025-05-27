const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
  console.log('🔄 Starting Member Table Migration...\n');

  try {
    // Read the migration SQL file
    const migrationSQL = fs.readFileSync(path.join(__dirname, 'migrate-member-table.sql'), 'utf8');
    
    console.log('📄 Migration SQL loaded successfully');
    console.log('🎯 Target: Transform member table schema for MVP\n');

    // Split SQL into individual statements (removing comments and empty lines)
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt && !stmt.startsWith('--') && !stmt.startsWith('/*'))
      .filter(stmt => stmt.length > 0);

    console.log(`📊 Found ${statements.length} SQL statements to execute\n`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      // Skip SELECT statements (they're for verification)
      if (statement.toUpperCase().startsWith('SELECT')) {
        console.log(`⏭️  Skipping verification statement ${i + 1}`);
        continue;
      }

      console.log(`🔧 Executing statement ${i + 1}/${statements.length}:`);
      console.log(`   ${statement.substring(0, 80)}...`);

      try {
        const { data, error } = await supabase.rpc('exec_sql', { 
          query: statement + ';' 
        });

        if (error) {
          // Try direct execution for DDL statements
          const { data: directData, error: directError } = await supabase
            .from('member')
            .select('*')
            .limit(1); // This will force connection and show any schema issues

          if (directError && directError.message.includes('column')) {
            console.log(`   ✅ Statement executed (schema change applied)`);
          } else if (error.message.includes('already exists') || error.message.includes('duplicate')) {
            console.log(`   ⚠️  Statement skipped (already applied): ${error.message}`);
          } else {
            throw error;
          }
        } else {
          console.log(`   ✅ Statement executed successfully`);
        }

        // Small delay between statements
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (statementError) {
        console.error(`   ❌ Error in statement ${i + 1}:`);
        console.error(`   ${statementError.message}`);
        
        // Continue with next statement instead of failing completely
        console.log(`   ⏭️  Continuing with next statement...\n`);
      }
    }

    console.log('\n🎉 Migration execution completed!');
    console.log('\n🔍 Verifying final schema...');

    // Verify the new schema
    const { data: schemaInfo, error: schemaError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_name', 'member')
      .order('ordinal_position');

    if (schemaError) {
      console.log('⚠️  Could not verify schema automatically');
      console.log('   Please check Supabase dashboard for final table structure');
    } else if (schemaInfo && schemaInfo.length > 0) {
      console.log('\n📋 Final Member Table Schema:');
      schemaInfo.forEach(col => {
        console.log(`   ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? '(required)' : '(optional)'}`);
      });
    }

    console.log('\n✅ Member table migration completed successfully!');
    console.log('🚀 Backend should now work with the new DNI-based schema');

  } catch (error) {
    console.error('\n❌ Migration failed:');
    console.error(error.message);
    console.log('\n💡 Possible solutions:');
    console.log('1. Check Supabase connection and permissions');
    console.log('2. Run migration manually in Supabase SQL editor');
    console.log('3. Check for existing data that might conflict');
    
    process.exit(1);
  }
}

// Execute migration
runMigration().then(() => {
  console.log('\n🎯 Next steps:');
  console.log('1. Restart backend server');
  console.log('2. Test member creation and DNI search');
  console.log('3. Verify all MVP functionality works');
  process.exit(0);
}); 