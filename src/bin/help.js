import chalk from "chalk";
import isMonth from "@splash-cli/is-month";
import pkg from "../../package.json";

export default chalk`{bold Usage}
	${isMonth("december") ? chalk`{yellow Merry Christmas!}` : ""}
	
	$ {green splash} {dim [command] [flags]}


{bold {cyan Commands}}
	{cyan settings} {dim <get|set|restore>}	{dim GET/SET/RESTORE SETTINGS}
	{cyan alias} {dim <get|set>}			{dim GET/SET COLLECTION ALIASES}

{bold {yellow Options}}
	{yellow -h --help}			{dim THIS MESSAGE}
	{yellow -v --version}			{dim ${pkg.version}}

	{yellow -s --save [optional_path]} 	{dim DOWNLOAD WITHOUT SETTING AS WALLPAPER}

	{yellow -i --info}			{dim SHOW EXIF}
	{yellow -q --quiet}			{dim NO OUTPUT}


{bold {red Source Filters}}
	{red -u --user} {dim <username>}		{dim RANDOM PHOTO FROM PROVIDED USER}
	{red --collection} {dim <id|alias>}		{dim RANDOM PHOTO FROM PROVIDED COLLECTION}
	{red -c --curated}			{dim RANDOM CURATED PHOTO}
	{red --id} {dim <id|url>}			{dim PHOTO BY ID}
	{red --day}				{dim GET THE PHOTO OF THE DAY}
	
{bold {red Search Filters}}
	{red -f --featured}			{dim LIMIT TO ONLY FEATURED PHOTOS}
	{red --query} {dim <query>}			{dim RANDOM FROM QUERY}
`;
