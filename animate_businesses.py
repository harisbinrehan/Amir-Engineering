import re

with open('src/components/home/businesses-intro.tsx', 'r') as f:
    content = f.read()

# 1. Add use client and motion import
if '"use client";' not in content:
    content = '"use client";\n\n' + content
    content = content.replace('import Link from "next/link";', 'import Link from "next/link";\nimport { motion } from "motion/react";')

# 2. Header animation
header_match = re.search(r'(<div className="mx-auto max-w-2xl text-center">)', content)
if header_match:
    header_repl = '''<motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mx-auto max-w-2xl text-center"
      >'''
    content = content.replace(header_match.group(1), header_repl)
    # find corresponding closing div - it's right before <div className="mt-12
    content = content.replace('      </div>\n\n      <div className="mt-12', '      </motion.div>\n\n      <div className="mt-12')

# 3. Grid container animation
grid_match = re.search(r'(<div className="mt-12 grid gap-6 md:grid-cols-2">)', content)
if grid_match:
    grid_repl = '''<motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
        }}
        className="mt-12 grid gap-6 md:grid-cols-2"
      >'''
    content = content.replace(grid_match.group(1), grid_repl)
    # The container closes right before </Section>
    content = content.replace('      </div>\n    </Section>', '      </motion.div>\n    </Section>')

# 4. Grid items
item_match = '<div className="border-border bg-card group flex flex-col overflow-hidden rounded-xl border">'
item_repl = '''<motion.div 
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
          }}
          className="border-border bg-card group flex flex-col overflow-hidden rounded-xl border"
        >'''
content = content.replace(item_match, item_repl)

# 5. Grid items closing tags
content = content.replace('        </div>\n\n        <motion.div', '        </motion.div>\n\n        <motion.div')
# The second item closes right before the grid container closing div
content = content.replace('        </div>\n      </motion.div>\n    </Section>', '        </motion.div>\n      </motion.div>\n    </Section>')

with open('src/components/home/businesses-intro.tsx', 'w') as f:
    f.write(content)
