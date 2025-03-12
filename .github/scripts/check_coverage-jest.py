import xml.etree.ElementTree as ET
import sys
import os
expected_args = [
    "min_coverage",
    "branch",
    "stage",
    "job",
]
usable_args = {
    "min_coverage":100,
}

for arg in sys.argv:
    for expected_arg in expected_args:
        full_arg = '--' + expected_arg + '='
        current_arg = arg[:len(full_arg)]
        current_value = arg[len(full_arg):]
        if(full_arg == current_arg):
            usable_args[expected_arg] = current_value
        
if os.path.exists('coverage/clover.xml'):
    tree = ET.parse('coverage/clover.xml')
    root = tree.getroot()
    covered = float(root[0][0].attrib['coveredstatements'])
    total   = float(root[0][0].attrib['statements'])
    coverage = covered/total
    coverage = round(coverage * 100,2)
    if coverage < float(usable_args['min_coverage']):
        text = "#CIRUN Branch: " + usable_args['branch'] + " | Stage: " + usable_args['stage'] + " | Job: " + usable_args['job'] + " | COVERAGE NOT ENOUGH: " + str(coverage) + "% but min " + str(usable_args['min_coverage']) + "%"
        exit(2)
else:
    text = "#CIRUN Branch: " + usable_args['branch'] + " | Stage: " + usable_args['stage'] + " | Job: " + usable_args['job'] + " | COVERAGE NOT AVAILABLE"
    exit(3)

print(coverage)
